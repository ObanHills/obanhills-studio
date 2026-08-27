// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Shared TypeScript interfaces for the ObanHills Creative Studio portfolio.
// ─────────────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  likes_count: number;
  created_at: string;
  cover_image_url?: string | null;
  gallery_images?: string[];
  project_url?: string | null;
  category?: string | null;
  /** Assigned client-side when mapping projects to 3D positions */
  position?: [number, number, number];
  /** Assigned client-side for node color variety */
  color?: string;
}

export interface Comment {
  id: string;
  project_id: string;
  author_name: string;
  content: string;
  created_at: string;
}
