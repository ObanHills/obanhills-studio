import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://obanhills.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://obanhills.vercel.app/admin",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
    },
  ];
}
