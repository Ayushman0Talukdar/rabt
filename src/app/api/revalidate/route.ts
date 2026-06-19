import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (authorization !== `Bearer ${env.previewSecret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type } = await req.json();
    if (type) {
      revalidateTag(type, "max");
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }
    return NextResponse.json({ message: "Missing document type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
