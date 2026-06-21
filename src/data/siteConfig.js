import configSource from "../../site.config.toml?raw";
import { parseTomlLite } from "./tomlLite.js";

const defaults = {
  sections: {
    hero: true,
    education: true,
    organizations: true,
    expertise: true,
    mindmap: true,
    geocv: true,
    projects: true,
    blogPreview: true,
    publications: true
  },
  pages: {
    blog: true,
    personal: true
  },
  features: {
    languageToggle: true,
    themeToggle: true,
    contactButton: true,
    geojsonDownload: true,
    linkedinShare: true
  },
  defaults: {
    language: "en",
    theme: "dark"
  },
  content: {
    blogSource: "hugo-drafts/content/blog",
    blogPreviewLimit: 3
  }
};

const parsed = parseTomlLite(configSource);

export const siteConfig = {
  ...defaults,
  ...parsed,
  sections: {
    ...defaults.sections,
    ...(parsed.sections ?? {})
  },
  pages: {
    ...defaults.pages,
    ...(parsed.pages ?? {})
  },
  features: {
    ...defaults.features,
    ...(parsed.features ?? {})
  },
  defaults: {
    ...defaults.defaults,
    ...(parsed.defaults ?? {})
  },
  content: {
    ...defaults.content,
    ...(parsed.content ?? {})
  }
};
