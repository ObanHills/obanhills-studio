// app/api/projects/[slug]/comments/route.ts
// GET  /api/projects/:slug/comments — fetch all comments for a project
// POST /api/projects/:slug/comments — create a new comment

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  // Resolve project id from slug or rawSlug
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, slug")
    .or(`slug.eq.${slug},slug.eq.${rawSlug}`)
    .maybeSingle();

  if (projectError || !project) {
    // Return empty array instead of error so the UI shows '0 Comments' smoothly
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data || []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  const body = await request.json();
  const { author_name, content } = body as {
    author_name?: string;
    content: string;
  };

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
  }

  // Resolve project id from slug
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, slug")
    .or(`slug.eq.${slug},slug.eq.${rawSlug}`)
    .maybeSingle();

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      project_id: project.id,
      author_name: author_name?.trim() || "Anonymous Visitor",
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
