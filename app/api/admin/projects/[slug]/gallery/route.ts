// app/api/admin/projects/[slug]/gallery/route.ts
// POST   — upload a new image to the project gallery in Supabase Storage and append URL to gallery_images
// DELETE — remove an image URL from gallery_images

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const path = `${slug}-gallery-${Date.now()}-${uniqueId}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("project-covers")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("project-covers")
    .getPublicUrl(path);

  const newImageUrl = urlData.publicUrl;

  // Fetch current project by slug or rawSlug
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, slug, gallery_images, cover_image_url")
    .or(`slug.eq.${slug},slug.eq.${rawSlug}`)
    .maybeSingle();

  if (fetchError || !project) {
    return NextResponse.json({ error: "Project not found in database. Please make sure the project exists." }, { status: 404 });
  }

  const currentGallery = Array.isArray(project.gallery_images) ? project.gallery_images : [];
  const updatedGallery = [...currentGallery, newImageUrl];

  // Also set as cover_image_url if project currently doesn't have one
  const updatePayload: Record<string, unknown> = { gallery_images: updatedGallery };
  if (!project.cover_image_url) {
    updatePayload.cover_image_url = newImageUrl;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", project.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    gallery_images: updatedGallery,
    new_image_url: newImageUrl,
    cover_image_url: project.cover_image_url || newImageUrl,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, slug, gallery_images")
    .or(`slug.eq.${slug},slug.eq.${rawSlug}`)
    .maybeSingle();

  if (fetchError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const currentGallery = Array.isArray(project.gallery_images) ? project.gallery_images : [];
  const updatedGallery = currentGallery.filter((url: string) => url !== imageUrl);

  const { error: updateError } = await supabase
    .from("projects")
    .update({ gallery_images: updatedGallery })
    .eq("id", project.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ gallery_images: updatedGallery });
}
