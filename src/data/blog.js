import { parseTomlLite } from "./tomlLite.js";

const modules = import.meta.glob("../../hugo-drafts/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});

function splitFrontmatter(source) {
  const match = source.match(/^\+\+\+\s*([\s\S]*?)\s*\+\+\+\s*([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: source.trim() };
  return {
    frontmatter: parseTomlLite(match[1]),
    content: match[2].trim()
  };
}

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

export const blogPosts = Object.entries(modules)
  .map(([path, source]) => {
    const { frontmatter, content } = splitFrontmatter(source);
    const slug = frontmatter.slug ?? slugFromPath(path);
    return {
      ...frontmatter,
      id: frontmatter.id ?? slug,
      slug,
      content,
      links: frontmatter.links ?? [],
      materials: frontmatter.materials ?? [],
      tags: frontmatter.tags ?? []
    };
  })
  .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));

export function findBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug || post.id === slug);
}
