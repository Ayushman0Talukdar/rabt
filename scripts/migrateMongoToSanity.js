require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { createClient } = require('@sanity/client');

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false,
});

// Load MongoDB Schemas directly matching models.js
const WorkCardSchema = new mongoose.Schema({
  name: String,
  role: String,
  metric: String,
  highlight: String,
  platform: String,
  image: String,
  growth: String
});

const ReviewSchema = new mongoose.Schema({
  quote: String,
  name: String,
  role: String,
  avatarUrl: String
});

const VideoSchema = new mongoose.Schema({
  videoId: String,
  category: String,
  type: String,
  title: String,
  description: String,
  tags: [String]
});

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const PillSchema = new mongoose.Schema({
  label: String,
  avatarBg: String,
  pillBg: String,
  border: String,
  glow: String,
  row: Number,
  avatarUrl: String
});

const WorkCard = mongoose.models.WorkCard || mongoose.model('WorkCard', WorkCardSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
const Pill = mongoose.models.Pill || mongoose.model('Pill', PillSchema);

async function downloadAndUploadImage(url, filename) {
  if (!url || !url.startsWith('http')) return null;
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.buffer();
    
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: filename || path.basename(url),
    });
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Failed to upload image ${url}:`, error.message);
    return null;
  }
}

async function run() {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error('Please define the MONGODB_URL environment variable in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected.');

  // Create backups folder
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. Fetch data from Mongo
  const faqs = await FAQ.find({}).lean();
  const reviews = await Review.find({}).lean();
  const videos = await Video.find({}).lean();
  const pills = await Pill.find({}).lean();
  const workcards = await WorkCard.find({}).lean();

  // 2. Write Backup JSON files
  fs.writeFileSync(path.join(backupDir, 'faqs.json'), JSON.stringify(faqs, null, 2));
  fs.writeFileSync(path.join(backupDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
  fs.writeFileSync(path.join(backupDir, 'videos.json'), JSON.stringify(videos, null, 2));
  fs.writeFileSync(path.join(backupDir, 'pills.json'), JSON.stringify(pills, null, 2));
  fs.writeFileSync(path.join(backupDir, 'workcards.json'), JSON.stringify(workcards, null, 2));
  console.log(`Backups saved in: ${backupDir}`);

  // 3. Migrate FAQs
  console.log(`Migrating FAQs (${faqs.length})...`);
  for (let i = 0; i < faqs.length; i++) {
    const item = faqs[i];
    await sanityClient.createOrReplace({
      _type: 'faq',
      _id: `faq-${item._id}`,
      question: item.question,
      answer: item.answer,
      order: i,
    });
  }

  // 4. Migrate Reviews
  console.log(`Migrating Reviews (${reviews.length})...`);
  for (let i = 0; i < reviews.length; i++) {
    const item = reviews[i];
    let avatarAsset = null;
    if (item.avatarUrl) {
      avatarAsset = await downloadAndUploadImage(item.avatarUrl, `avatar-${item._id}`);
    }
    await sanityClient.createOrReplace({
      _type: 'review',
      _id: `review-${item._id}`,
      name: item.name,
      role: item.role,
      quote: item.quote,
      ...(avatarAsset && { avatar: avatarAsset }),
      order: i,
    });
  }

  // 5. Migrate Videos
  console.log(`Migrating Videos (${videos.length})...`);
  for (let i = 0; i < videos.length; i++) {
    const item = videos[i];
    await sanityClient.createOrReplace({
      _type: 'video',
      _id: `video-${item._id}`,
      title: item.title,
      videoId: item.videoId,
      category: item.category,
      type: item.type,
      description: item.description,
      tags: item.tags || [],
      order: i,
    });
  }

  // 6. Migrate Pills
  console.log(`Migrating Creator Tags/Pills (${pills.length})...`);
  for (let i = 0; i < pills.length; i++) {
    const item = pills[i];
    let avatarAsset = null;
    if (item.avatarUrl) {
      avatarAsset = await downloadAndUploadImage(item.avatarUrl, `pill-${item._id}`);
    }
    await sanityClient.createOrReplace({
      _type: 'pill',
      _id: `pill-${item._id}`,
      label: item.label,
      row: item.row || 1,
      ...(avatarAsset && { avatar: avatarAsset }),
      theme: {
        avatarBg: item.avatarBg,
        pillBg: item.pillBg,
        border: item.border,
        glow: item.glow,
      },
      order: i,
    });
  }

  // 7. Migrate WorkCards
  console.log(`Migrating Work Cards (${workcards.length})...`);
  for (let i = 0; i < workcards.length; i++) {
    const item = workcards[i];
    let imageAsset = null;
    if (item.image) {
      imageAsset = await downloadAndUploadImage(item.image, `workcard-${item._id}`);
    }
    await sanityClient.createOrReplace({
      _type: 'workCard',
      _id: `workcard-${item._id}`,
      name: item.name,
      role: item.role,
      metric: item.metric,
      highlight: item.highlight,
      growth: item.growth,
      platform: ['YouTube', 'Instagram', 'TikTok', 'LinkedIn'].includes(item.platform) ? item.platform : 'YouTube',
      ...(imageAsset && { image: imageAsset }),
      order: i,
    });
  }

  console.log('Migration completed successfully.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  mongoose.disconnect();
});
