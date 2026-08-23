// app/api/projects/[slug]/like/route.ts
// POST /api/projects/:slug/like — atomically increments likes_count by 1.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("increment_like", { project_slug: slug });

  if (error) {
    // Fallback: manual increment if RPC doesn't exist yet
    const { data: project } = await supabase
      .from("projects")
      .select("likes_count")
      .eq("slug", slug)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("projects")
      .update({ likes_count: project.likes_count + 1 })
      .eq("slug", slug)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  }

  return NextResponse.json(data);
}
