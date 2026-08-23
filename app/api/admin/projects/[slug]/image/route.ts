// app/api/admin/projects/[slug]/image/route.ts
// POST — upload a cover image for a project to Supabase Storage,
//        then update the project's cover_image_url in the database.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const supabase = await createClient();

  // Build storage path: project-covers/<slug>.<ext>
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}.${ext}`;

  // Convert File to ArrayBuffer for Supabase upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("project-covers")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true, // overwrite if exists
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("project-covers")
    .getPublicUrl(path);

  const cover_image_url = urlData.publicUrl;

  // Update the project row
  const { error: updateError } = await supabase
    .from("projects")
    .update({ cover_image_url })
    .eq("slug", slug);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ cover_image_url });
}
