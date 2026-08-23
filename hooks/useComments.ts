// hooks/useComments.ts
// Fetches comments for the active project and subscribes to Supabase Realtime
// for live updates across browser tabs.

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types";

export function useComments(projectSlug: string | null, projectId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!projectSlug) {
      setComments([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectSlug]);

  // Fetch on project change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Supabase Realtime subscription for live comments
  useEffect(() => {
    if (!projectId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`realtime-comments-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments((prev) => {
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [newComment, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const postComment = useCallback(
    async (content: string, author_name?: string) => {
      if (!projectSlug) return;
      const res = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author_name }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const created = await res.json();
      if (created && created.id) {
        setComments((prev) => {
          if (prev.some((c) => c.id === created.id)) return prev;
          return [created, ...prev];
        });
      }
    },
    [projectSlug]
  );

  return { comments, isLoading, error, postComment };
}
