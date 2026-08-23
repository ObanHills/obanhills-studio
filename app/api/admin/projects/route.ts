// app/api/admin/projects/route.ts
// GET  — list all projects (admin, ordered newest first)
// POST — create a new project

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { title, slug, description, project_url, category, cover_image_url, gallery_images } =
    body as {
      title: string;
      slug: string;
      description: string;
      project_url?: string;
      category?: string;
      cover_image_url?: string;
      gallery_images?: string[];
    };

  if (!title || !slug || !description) {
    return NextResponse.json(
      { error: "title, slug and description are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      description,
      project_url,
      category,
      cover_image_url,
      gallery_images: gallery_images || [],
      likes_count: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
