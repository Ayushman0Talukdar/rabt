import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  if (secret !== env.previewSecret) {
    return new Response("Invalid token", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();
  redirect(slug);
}
