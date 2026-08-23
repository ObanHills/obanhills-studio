// app/api/admin/projects/[slug]/route.ts
// PUT    — update a project by slug
// DELETE — delete a project by slug

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const body = await request.json();
  const { title, description, project_url, category, cover_image_url, gallery_images, new_slug } =
    body as {
      title?: string;
      description?: string;
      project_url?: string;
      category?: string;
      cover_image_url?: string;
      gallery_images?: string[];
      new_slug?: string;
    };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...(title && { title }),
      ...(description && { description }),
      ...(project_url !== undefined && { project_url }),
      ...(category !== undefined && { category }),
      ...(cover_image_url !== undefined && { cover_image_url }),
      ...(gallery_images !== undefined && { gallery_images }),
      ...(new_slug && { slug: new_slug }),
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
