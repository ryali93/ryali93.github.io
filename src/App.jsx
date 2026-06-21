import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Boxes,
  Braces,
  Building2,
  Camera,
  Code2,
  Database,
  Download,
  FileImage,
  Github,
  GraduationCap,
  Heart,
  Home,
  Languages,
  Linkedin,
  Layers3,
  Mail,
  Map,
  Microscope,
  Moon,
  Network,
  Orbit,
  PenLine,
  Satellite,
  Sun,
  University
} from "lucide-react";
import {
  education,
  expertise,
  geocvActivities,
  layerLabels,
  copy,
  mapStyleUrl,
  mindMap,
  navigation,
  organizations,
  personalProfile,
  profile,
  projects,
  publications,
  toGeoJson
} from "./data/portfolio.js";
import { blogPosts, findBlogPost } from "./data/blog.js";
import { siteConfig } from "./data/siteConfig.js";

const heroImage = `${import.meta.env.BASE_URL}assets/geospatial-hero.png`;
const layerColors = {
  public: "#7fb3d5",
  research: "#58c4a6",
  teaching: "#f0b75e",
  open: "#b59cff"
};
const layerColor = (layer) => layerColors[layer] ?? "#54d8b0";

function pick(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] ?? value.es ?? value.en ?? "";
  }
  return value;
}

function field(item, key, language) {
  if (language === "en" && item?.[`${key}En`]) return item[`${key}En`];
  return pick(item?.[key], language);
}

function listField(item, key, language) {
  if (language === "en" && Array.isArray(item?.[`${key}En`])) return item[`${key}En`];
  return item?.[key] ?? [];
}

function activityTitle(activity, language) {
  return language === "en" ? activity.titleEn ?? activity.title : activity.title;
}

function activityShort(activity, language) {
  return language === "en" ? activity.shortEn ?? activity.short : activity.short;
}

function activityContributions(activity, language) {
  return language === "en" ? activity.contributionsEn ?? activity.contributions : activity.contributions;
}

function routeFromHash(hash) {
  if (hash.startsWith("#/blog/")) {
    return { name: "blog-detail", slug: decodeURIComponent(hash.replace("#/blog/", "")) };
  }
  if (hash.startsWith("#/blog")) return { name: "blog" };
  if (hash.startsWith("#/personal")) return { name: "personal" };
  return { name: "home" };
}

function sectionEnabled(key) {
  return siteConfig.sections?.[key] !== false;
}

function pageEnabled(key) {
  return siteConfig.pages?.[key] !== false;
}

function featureEnabled(key) {
  return siteConfig.features?.[key] !== false;
}

function configuredTheme() {
  return siteConfig.defaults?.theme === "light" ? "light" : "dark";
}

function configuredLanguage() {
  return siteConfig.defaults?.language === "es" ? "es" : "en";
}

function visibleNavigation() {
  return navigation.filter((item) => {
    if (item.href === "#education") return sectionEnabled("education");
    if (item.href === "#expertise") return sectionEnabled("expertise");
    if (item.href === "#geocv") return sectionEnabled("geocv");
    if (item.href === "#projects") return sectionEnabled("projects");
    if (item.href === "#papers") return sectionEnabled("publications");
    if (item.href === "#/blog") return pageEnabled("blog");
    if (item.href === "#/personal") return pageEnabled("personal");
    return true;
  });
}

function blogPostHref(post) {
  return `#/blog/${encodeURIComponent(post.slug ?? post.id)}`;
}

function useTheme() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return configuredTheme();
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return configuredTheme();
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem("theme", next);
  }

  return { theme, toggleTheme };
}

function useLanguage() {
  const getInitialLanguage = () => {
    if (typeof window === "undefined") return configuredLanguage();
    const saved = window.localStorage.getItem("language");
    if (saved === "en" || saved === "es") return saved;
    return configuredLanguage();
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function toggleLanguage() {
    const next = language === "es" ? "en" : "es";
    setLanguage(next);
    window.localStorage.setItem("language", next);
  }

  return { language, toggleLanguage };
}

function useRoute() {
  const getInitialRoute = () => {
    if (typeof window === "undefined") return { name: "home" };
    return routeFromHash(window.location.hash);
  };

  const [route, setRoute] = useState(getInitialRoute);

  useEffect(() => {
    function handleHashChange() {
      setRoute(routeFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}

function useInteractiveBackground() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return undefined;

    let frame = 0;

    function handlePointerMove(event) {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        const root = document.documentElement;

        root.style.setProperty("--bg-focus-x", `${Math.round(x * 100)}%`);
        root.style.setProperty("--bg-focus-y", `${Math.round(y * 100)}%`);
        root.style.setProperty("--contour-shift-x", `${((x - 0.5) * 18).toFixed(2)}px`);
        root.style.setProperty("--contour-shift-y", `${((y - 0.5) * 14).toFixed(2)}px`);
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);
}

function Header({ theme, language, text, onThemeToggle, onLanguageToggle }) {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Ir al inicio">
        <span className="brand-mark">
          {profile.logo ? (
            <img src={`${import.meta.env.BASE_URL}${profile.logo}`} alt={profile.logoAlt ?? profile.name} />
          ) : (
            "RY"
          )}
        </span>
        <span>
          <strong>{profile.name}</strong>
          <small>{text.profileTitle}</small>
        </span>
      </a>

      <nav className="nav" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
        {visibleNavigation().map((item) => (
          <a key={item.href} href={item.href}>
            {pick(item.label, language)}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        {featureEnabled("languageToggle") && (
          <button className="language-button" type="button" onClick={onLanguageToggle} aria-label={text.languageAria}>
            <Languages size={17} />
            <span>{text.languageLabel}</span>
          </button>
        )}
        {featureEnabled("themeToggle") && (
          <button className="icon-button" type="button" onClick={onThemeToggle} aria-label="Cambiar tema">
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        {featureEnabled("contactButton") && (
          <a className="contact-button" href={`mailto:${profile.email}`}>
            <Mail size={16} />
            {text.contact}
          </a>
        )}
      </div>
    </header>
  );
}

function Hero({ text }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">{text.heroKicker}</p>
        <h1>{text.heroTitle}</h1>
        <p className="hero-lead">{text.heroSummary}</p>

        <div className="hero-actions">
          <a className="button primary" href="#education">
            <GraduationCap size={17} />
            {text.buttons.education}
          </a>
          <a className="button secondary" href="#geocv">
            <Orbit size={17} />
            {text.buttons.trajectory}
          </a>
          <a className="button subtle" href="https://github.com/ryali93">
            <Github size={17} />
            {text.buttons.code}
          </a>
        </div>

        <div className="metric-strip" aria-label={text.sections.education.kicker}>
          {text.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className="hero-media" aria-label="Visual geoespacial">
        <img src={heroImage} alt="Visual de datos geoespaciales, Andes, Amazonía y capas satelitales" />
        <div className="hero-media-panel">
          <span>{text.heroPanelKicker}</span>
          <strong>{text.heroPanelTitle}</strong>
          <p>{text.heroPanelCopy}</p>
        </div>
      </aside>
    </section>
  );
}

function SectionHeading({ kicker, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}

function EducationSection({ text, language }) {
  const icons = [Microscope, Code2, Map];
  return (
    <section className="section education-section" id="education">
      <SectionHeading kicker={text.sections.education.kicker} title={text.sections.education.title}>
        {text.sections.education.copy}
      </SectionHeading>

      <div className="education-grid">
        {education.map((item, index) => {
          const Icon = icons[index] ?? GraduationCap;
          return (
            <article key={item.degree} className="education-card">
              <div className="card-icon"><Icon size={21} /></div>
              <time>{item.period}</time>
              <h3>{field(item, "degree", language)}</h3>
              <strong>{field(item, "institution", language)}</strong>
              <p>{field(item, "focus", language)}</p>
              <div className="tag-row">
                {listField(item, "tags", language).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OrganizationMark({ org }) {
  const Icon = org.kind === "academic" ? University : org.kind === "research" ? Microscope : Building2;
  return (
    <a className="org-mark" href={org.href} title={org.fullName}>
      <Icon size={18} />
      <span>{org.name}</span>
    </a>
  );
}

function OrganizationStrip() {
  return (
    <section className="org-strip" aria-label="Instituciones y comunidades">
      {organizations.map((org) => (
        <OrganizationMark key={org.id} org={org} />
      ))}
    </section>
  );
}

function ActivityLogo({ activity, compact = false }) {
  const logo = activity.logo ?? { initials: activity.organization.slice(0, 2), label: activity.organization, tone: activity.layer };
  return (
    <div className={`activity-logo ${compact ? "compact" : ""} ${logo.tone ?? activity.layer}`}>
      <span>{logo.initials}</span>
      {!compact && <small>{logo.label}</small>}
    </div>
  );
}

function ExpertiseSection({ text, language }) {
  const icons = [Satellite, Braces, Database, Layers3, Network, Boxes];
  return (
    <section className="section" id="expertise">
      <SectionHeading kicker={text.sections.expertise.kicker} title={text.sections.expertise.title}>
        {text.sections.expertise.copy}
      </SectionHeading>

      <div className="expertise-grid">
        {expertise.map((item, index) => {
          const Icon = icons[index] ?? Layers3;
          return (
            <article key={item.title} className="expertise-card">
              <div className="card-icon"><Icon size={21} /></div>
              <h3>{field(item, "title", language)}</h3>
              <p>{field(item, "summary", language)}</p>
              <div className="tag-row">
                {listField(item, "skills", language).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ExpertiseMindMap({ text, language }) {
  const center = { x: 560, y: 340 };
  const groups = mindMap.groups.map((group, index) => {
    const positions = [
      { x: 300, y: 235, direction: "left" },
      { x: 560, y: 158, direction: "top" },
      { x: 820, y: 235, direction: "right" },
      { x: 820, y: 445, direction: "right" },
      { x: 560, y: 540, direction: "bottom" },
      { x: 300, y: 445, direction: "left" }
    ];
    return {
      ...group,
      ...positions[index],
      label: field(group, "label", language),
      nodes: listField(group, "nodes", language)
    };
  });

  function branchNodes(group) {
    const verticalOffsets = [-88, -44, 0, 44, 88];
    const horizontalOffsets = [-320, -160, 0, 160, 320];

    return group.nodes.map((node, index) => {
      if (group.direction === "top") {
        return { label: node, x: group.x + horizontalOffsets[index], y: group.y - 102 };
      }
      if (group.direction === "bottom") {
        return { label: node, x: group.x + horizontalOffsets[index], y: group.y + 102 };
      }
      if (group.direction === "right") {
        return { label: node, x: group.x + 205, y: group.y + verticalOffsets[index] };
      }
      return { label: node, x: group.x - 205, y: group.y + verticalOffsets[index] };
    });
  }

  function linkPath(a, b) {
    const midX = (a.x + b.x) / 2;
    return `M${a.x} ${a.y} C${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
  }

  return (
    <section className="section mindmap-section" aria-label="Mapa mental de expertise">
      <SectionHeading kicker={text.sections.mindmap.kicker} title={text.sections.mindmap.title}>
        {text.sections.mindmap.copy}
      </SectionHeading>

      <div className="mindmap">
        <svg className="mindmap-svg" viewBox="0 0 1120 680" role="img" aria-label="Mapa mental de áreas de trabajo">
          <defs>
            <filter id="softNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.22" />
            </filter>
          </defs>
          {groups.map((group) => (
            <g key={`${group.label}-links`} className={`mind-branch ${group.color} ${group.color === "cyan" ? "ai-branch" : ""}`}>
              <path className="mind-link main" d={linkPath(center, group)} />
              {branchNodes(group).map((node) => (
                <path key={node.label} className="mind-link" d={linkPath(group, node)} />
              ))}
            </g>
          ))}
          <foreignObject x={440} y={292} width={240} height={96}>
            <div className="mind-node center-node">
              {/* <span>centro</span> */}
              <strong>{field(mindMap, "center", language)}</strong>
            </div>
          </foreignObject>
          {groups.map((group) => (
            <g key={group.label} className={`mind-branch ${group.color} ${group.color === "cyan" ? "ai-branch" : ""}`}>
              <foreignObject x={group.x - 104} y={group.y - 34} width={208} height={68}>
                <div className="mind-node group-node">
                  <strong>{group.label}</strong>
                </div>
              </foreignObject>
              {branchNodes(group).map((node) => (
                <foreignObject key={node.label} x={node.x - 77} y={node.y - 21} width={154} height={42}>
                  <div className="mind-node child-node">{node.label}</div>
                </foreignObject>
              ))}
            </g>
          ))}
        </svg>

        <div className="mindmap-mobile" aria-label="Mapa de áreas de trabajo">
          <div className="mindmap-mobile-center">
            <span>{language === "en" ? "center" : "centro"}</span>
            <strong>{field(mindMap, "center", language)}</strong>
          </div>
          {groups.map((group) => (
            <div key={`${group.label}-mobile`} className={`mindmap-mobile-group mind-branch ${group.color} ${group.color === "cyan" ? "featured-ai" : ""}`}>
              <strong>{group.label}</strong>
              <div className="mindmap-mobile-nodes">
                {group.nodes.map((node) => (
                  <span key={node}>{node}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function activityLngLat(activity) {
  return [activity.coordinates[1], activity.coordinates[0]];
}

function routesGeoJson(activities) {
  const lima = [-77.0428, -12.0464];
  return {
    type: "FeatureCollection",
    features: activities.map((activity) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [lima, activityLngLat(activity)]
      },
      properties: {
        id: activity.id,
        layer: activity.layer,
        color: layerColor(activity.layer)
      }
    }))
  };
}

function boundsForActivities(activities, maplibregl) {
  const bounds = new maplibregl.LngLatBounds();
  activities.forEach((activity) => bounds.extend(activityLngLat(activity)));
  return bounds;
}

function GeoCvMap({ activities, active, onSelect, language, text }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);
  const popupRef = useRef(null);
  const hasFocusedActiveRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const activeId = active.id;

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return undefined;
    let disposed = false;
    let map;

    async function setupMap() {
      const maplibreModule = await import("maplibre-gl");
      const maplibregl = maplibreModule.default ?? maplibreModule;
      if (disposed || !mapContainer.current) return;

      maplibreRef.current = maplibregl;
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [-56, 2],
        zoom: 1.45,
        pitch: 0,
        bearing: -10,
        projection: { type: "globe" },
        attributionControl: false
      });

      mapRef.current = map;
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 16,
        maxWidth: "280px"
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new maplibregl.FullscreenControl(), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

      map.on("load", () => {
        map.addSource("geocv-routes", {
          type: "geojson",
          data: routesGeoJson(activities)
        });
        map.addSource("geocv-points", {
          type: "geojson",
          data: toGeoJson(activities)
        });

        map.addLayer({
          id: "geocv-routes",
          type: "line",
          source: "geocv-routes",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 1.7,
            "line-opacity": 0.58,
            "line-dasharray": [1.5, 1.2]
          }
        });

        map.addLayer({
          id: "geocv-points-halo",
          type: "circle",
          source: "geocv-points",
          paint: {
            "circle-radius": ["case", ["==", ["get", "id"], activeId], 18, 12],
            "circle-color": ["match", ["get", "layer"], "public", layerColors.public, "research", layerColors.research, "teaching", layerColors.teaching, "open", layerColors.open, "#54d8b0"],
            "circle-opacity": ["case", ["==", ["get", "id"], activeId], 0.2, 0.08]
          }
        });

        map.addLayer({
          id: "geocv-points",
          type: "circle",
          source: "geocv-points",
          paint: {
            "circle-radius": ["case", ["==", ["get", "id"], activeId], 8.5, 6],
            "circle-color": ["match", ["get", "layer"], "public", layerColors.public, "research", layerColors.research, "teaching", layerColors.teaching, "open", layerColors.open, "#54d8b0"],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": ["case", ["==", ["get", "id"], activeId], 2.2, 1.4]
          }
        });

        map.addLayer({
          id: "geocv-labels",
          type: "symbol",
          source: "geocv-points",
        layout: {
          "text-field": ["get", "organization"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 1.35],
            "text-anchor": "top",
            "text-allow-overlap": false
          },
          paint: {
            "text-color": "#0b171a",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.2
          }
        });

        map.on("click", "geocv-points", (event) => {
          const id = event.features?.[0]?.properties?.id;
          if (id) onSelect(id);
        });
        map.on("mouseenter", "geocv-points", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "geocv-points", () => {
          map.getCanvas().style.cursor = "";
        });

        setMapReady(true);
      });
    }

    setupMap();

    return () => {
      disposed = true;
      popupRef.current?.remove();
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    const maplibregl = maplibreRef.current;
    if (!maplibregl) return;

    map.getSource("geocv-points")?.setData(toGeoJson(activities));
    map.getSource("geocv-routes")?.setData(routesGeoJson(activities));

    if (activities.length > 1) {
      map.fitBounds(boundsForActivities(activities, maplibregl), {
        padding: { top: 70, right: 70, bottom: 70, left: 70 },
        maxZoom: 4.3,
        duration: 900
      });
    }
  }, [activities, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    const activeExpression = ["==", ["get", "id"], active.id];
    if (map.getLayer("geocv-points")) {
      map.setPaintProperty("geocv-points", "circle-radius", ["case", activeExpression, 8.5, 6]);
      map.setPaintProperty("geocv-points", "circle-stroke-width", ["case", activeExpression, 2.2, 1.4]);
      map.setPaintProperty("geocv-points-halo", "circle-radius", ["case", activeExpression, 18, 12]);
      map.setPaintProperty("geocv-points-halo", "circle-opacity", ["case", activeExpression, 0.2, 0.08]);
    }

    const coordinates = activityLngLat(active);
    if (hasFocusedActiveRef.current) {
      map.flyTo({
        center: coordinates,
        zoom: active.zoom ?? (Math.abs(active.coordinates[0]) < 1 && Math.abs(active.coordinates[1]) < 1 ? 1.8 : 3.7),
        speed: 0.75,
        curve: 1.4,
        essential: true
      });
    } else {
      hasFocusedActiveRef.current = true;
    }

    popupRef.current
      ?.setLngLat(coordinates)
      .setHTML(
        `<strong>${active.organization}</strong><span>${active.period}</span><p>${activityTitle(active, language)}</p>`
      )
      .addTo(map);
  }, [active, language, mapReady]);

  return (
    <div className="geocv-map-wrap">
      <div ref={mapContainer} className="geocv-map" aria-label={text.sections.geocv.title} />
    </div>
  );
}

function ResourceSlot({ icon: Icon, label, items }) {
  if (!items.length) return null;
  return (
    <div className="resource-slot">
      <Icon size={16} />
      <span>{label}</span>
      <strong>{items.length}</strong>
    </div>
  );
}

function ResourceGrid({ item, text }) {
  const resources = [
    { icon: Github, label: text.resources.repositories, items: item.repositories },
    { icon: FileImage, label: text.resources.images, items: item.images },
    { icon: Award, label: text.resources.awards, items: item.awards }
  ].filter((resource) => resource.items.length);

  if (!resources.length) return null;

  return (
    <div className="resource-grid" aria-label="Material adicional de experiencia">
      {resources.map((resource) => (
        <ResourceSlot key={resource.label} {...resource} />
      ))}
    </div>
  );
}

function renderInlineMarkdown(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${token}-${match.index}`;
    if (token.startsWith("**")) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(
        <a key={key} href={linkMatch?.[2] ?? "#"}>
          {linkMatch?.[1] ?? token}
        </a>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function MarkdownContent({ source }) {
  const elements = [];
  const lines = String(source ?? "").split(/\r?\n/);
  let paragraph = [];
  let list = [];
  let code = [];
  let inCode = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    elements.push(<p key={`p-${elements.length}`}>{renderInlineMarkdown(paragraph.join(" "))}</p>);
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`}>
        {list.map((item) => (
          <li key={item}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    list = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre key={`code-${elements.length}`}>
            <code>{code.join("\n")}</code>
          </pre>
        );
        code = [];
      } else {
        flushParagraph();
        flushList();
      }
      inCode = !inCode;
      return;
    }

    if (inCode) {
      code.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const Tag = heading[1].length === 2 ? "h2" : heading[1].length === 3 ? "h3" : "h4";
      elements.push(<Tag key={`h-${elements.length}`}>{renderInlineMarkdown(heading[2])}</Tag>);
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  if (code.length) {
    elements.push(
      <pre key={`code-${elements.length}`}>
        <code>{code.join("\n")}</code>
      </pre>
    );
  }

  return <div className="markdown-body">{elements}</div>;
}

function GeoCvSection({ language, text }) {
  const [layer, setLayer] = useState("all");
  const [activeId, setActiveId] = useState(geocvActivities[0].id);

  const filtered = useMemo(
    () => (layer === "all" ? geocvActivities : geocvActivities.filter((item) => item.layer === layer)),
    [layer]
  );
  const active = filtered.find((item) => item.id === activeId) ?? filtered[0] ?? geocvActivities[0];

  function changeLayer(nextLayer) {
    setLayer(nextLayer);
    const nextActivities = nextLayer === "all" ? geocvActivities : geocvActivities.filter((item) => item.layer === nextLayer);
    if (!nextActivities.some((item) => item.id === activeId)) {
      setActiveId(nextActivities[0]?.id ?? geocvActivities[0].id);
    }
  }

  const geoJsonHref = useMemo(() => {
    const json = JSON.stringify(toGeoJson(geocvActivities), null, 2);
    return `data:application/geo+json;charset=utf-8,${encodeURIComponent(json)}`;
  }, []);

  return (
    <section className="section geocv-section" id="geocv">
      <SectionHeading kicker={text.sections.geocv.kicker} title={text.sections.geocv.title}>
        {text.sections.geocv.copy}
      </SectionHeading>

      <div className="geocv-layout">
        <aside className="geocv-panel">
          <div className="layer-toolbar" role="toolbar" aria-label="Capas del GeoCV">
            {Object.entries(layerLabels).map(([key, label]) => (
              <button key={key} className={layer === key ? "active" : ""} type="button" onClick={() => changeLayer(key)}>
                {pick(label, language)}
              </button>
            ))}
          </div>

          <div className="activity-list">
            {filtered.map((activity) => (
              <button
                key={activity.id}
                className={`activity-card ${activity.id === active.id ? "active" : ""}`}
                type="button"
                onClick={() => setActiveId(activity.id)}
              >
                <ActivityLogo activity={activity} />
                <span>{activity.period} · {activity.place}</span>
                <strong>{activityTitle(activity, language)}</strong>
                <p>{activityShort(activity, language)}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="map-shell">
          <div className="map-toolbar">
            <div>
              <span>{text.map.toolbarKicker}</span>
              <strong>{active.organization} · {active.period}</strong>
            </div>
            {featureEnabled("geojsonDownload") && (
              <a className="download-link" href={geoJsonHref} download="roy-yali-geocv.geojson">
                <Download size={16} />
                {text.map.download}
              </a>
            )}
          </div>

          <GeoCvMap activities={filtered} active={active} onSelect={setActiveId} language={language} text={text} />

          <article className="activity-detail">
            <div className="activity-detail-head">
              <ActivityLogo activity={active} />
              <div>
                <p className="kicker">{pick(layerLabels[active.layer], language)} · {active.place}</p>
                <h3>{activityTitle(active, language)}</h3>
              </div>
            </div>
            <ul>
              {activityContributions(active, language).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="tag-row">
              {active.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <ResourceGrid item={active} text={text} />
            <div className="link-row">
              {active.evidence.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function BlogThumbnail({ post, language }) {
  const [failed, setFailed] = useState(false);
  const src = post.thumbnail ? `${import.meta.env.BASE_URL}${post.thumbnail}` : "";

  if (!src || failed) {
    return (
      <div className="blog-thumb fallback" aria-label={pick(post.title, language)}>
        <PenLine size={28} />
        <span>{pick(post.type, language)}</span>
      </div>
    );
  }

  return (
    <img
      className="blog-thumb"
      src={src}
      alt={pick(post.title, language)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function BlogPostCard({ post, language, text, compact = false }) {
  const links = post.links ?? [];
  const primaryLink = links[0];
  const detailHref = blogPostHref(post);
  const shareHref = primaryLink
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(primaryLink.href)}`
    : "https://www.linkedin.com/in/ryali93/";

  return (
    <article className={`blog-card ${compact ? "compact" : ""}`}>
      <BlogThumbnail post={post} language={language} />
      <div className="blog-card-body">
        <div className="note-meta">
          <span>{pick(post.format ?? post.type, language)}</span>
          <time>{post.date}</time>
          <span>{pick(post.readingTime, language)}</span>
        </div>
        <h3>
          <a href={detailHref}>{pick(post.title, language)}</a>
        </h3>
        <p>{pick(post.summary, language)}</p>
        {!compact && post.details && <p className="blog-detail">{pick(post.details, language)}</p>}
        {/* {!compact && (
          <div className="blog-comment">
            <span>{text.notes.commentary}</span>
            <p>{pick(post.comment, language)}</p>
          </div>
        )} */}

        <div className="blog-info-grid">
          <div>
            <span>{text.blog.audience}</span>
            <strong>{pick(post.audience, language)}</strong>
          </div>
          <div>
            <span>{text.blog.materials}</span>
            <div className="tag-row">
              {(post.materials ?? []).map((item) => (
                <span key={pick(item.label, language)}>{pick(item.label, language)}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="tag-row">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="blog-actions">
          <a href={detailHref}>
            <BookOpen size={15} />
            {text.blog.readMore}
          </a>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {pick(link.label, language)}
              <ArrowUpRight size={14} />
            </a>
          ))}
          {!compact && featureEnabled("linkedinShare") && (
            <a href={shareHref}>
              <Linkedin size={15} />
              {text.notes.shareLinkedin}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function BlogPreviewSection({ language, text }) {
  const previewLimit = Number(siteConfig.content?.blogPreviewLimit ?? 3);

  return (
    <section className="section blog-preview-section" id="blog-preview">
      <SectionHeading kicker={text.blog.previewKicker} title={text.blog.previewTitle}>
        {text.blog.previewCopy}
      </SectionHeading>

      <div className="blog-grid preview">
        {blogPosts.slice(0, previewLimit).map((post) => (
          <BlogPostCard key={post.id} post={post} language={language} text={text} compact />
        ))}
      </div>

      <div className="section-actions">
        <a className="button primary" href="#/blog">
          <BookOpen size={17} />
          {text.blog.openBlog}
        </a>
      </div>
    </section>
  );
}

function BlogPage({ language, text }) {
  return (
    <section className="section subpage notes-section" id="blog">
      <a className="back-link" href="#top">
        <Home size={15} />
        {language === "en" ? "Home" : "Inicio"}
      </a>
      <SectionHeading kicker={text.sections.notes.kicker} title={text.sections.notes.title}>
        {text.sections.notes.copy}
      </SectionHeading>

      <div className="blog-list">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} language={language} text={text} />
        ))}
      </div>
    </section>
  );
}

function BlogPostDetailPage({ post, language, text }) {
  if (!post) {
    return (
      <section className="section subpage notes-section" id="blog-detail">
        <a className="back-link" href="#/blog">
          <BookOpen size={15} />
          {language === "en" ? "Back to blog" : "Volver al blog"}
        </a>
        <SectionHeading
          kicker={text.sections.notes.kicker}
          title={language === "en" ? "Post not found" : "Entrada no encontrada"}
        >
          {language === "en"
            ? "The Markdown file may have been renamed or hidden."
            : "Es posible que el archivo Markdown haya cambiado de nombre o esté oculto."}
        </SectionHeading>
      </section>
    );
  }

  const links = post.links ?? [];
  const shareUrl = typeof window !== "undefined" ? window.location.href : links[0]?.href ?? "";
  const shareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <section className="section subpage blog-detail-page" id="blog-detail">
      <a className="back-link" href="#/blog">
        <BookOpen size={15} />
        {language === "en" ? "Back to blog" : "Volver al blog"}
      </a>

      <article className="post-detail-shell">
        <header className="post-detail-hero">
          <div>
            <div className="note-meta">
              <span>{pick(post.format ?? post.type, language)}</span>
              <time>{post.date}</time>
              <span>{pick(post.readingTime, language)}</span>
            </div>
            <h1>{pick(post.title, language)}</h1>
            <p className="hero-lead">{pick(post.summary, language)}</p>
            <div className="tag-row">
              {(post.tags ?? []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <BlogThumbnail post={post} language={language} />
        </header>

        <div className="post-detail-grid">
          <aside className="post-sidebar" aria-label={language === "en" ? "Post metadata" : "Metadatos de la entrada"}>
            <div className="post-sidebar-block">
              <span>{text.blog.audience}</span>
              <strong>{pick(post.audience, language)}</strong>
            </div>

            {/* {post.comment && (
              <div className="post-sidebar-block">
                <span>{text.notes.commentary}</span>
                <p>{pick(post.comment, language)}</p>
              </div>
            )} */}

            {(post.materials ?? []).length > 0 && (
              <div className="post-sidebar-block">
                <span>{text.blog.materials}</span>
                <div className="tag-row">
                  {post.materials.map((item) => (
                    <span key={pick(item.label, language)}>{pick(item.label, language)}</span>
                  ))}
                </div>
              </div>
            )}

            {links.length > 0 && (
              <div className="post-sidebar-block">
                <span>{text.notes.source}</span>
                <div className="link-row">
                  {links.map((link) => (
                    <a key={link.href} href={link.href}>
                      {pick(link.label, language)}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {featureEnabled("linkedinShare") && (
              <a className="button secondary post-share" href={shareHref}>
                <Linkedin size={16} />
                {text.notes.shareLinkedin}
              </a>
            )}
          </aside>

          <MarkdownContent source={post.content} />
        </div>
      </article>
    </section>
  );
}

function PersonalPhoto({ text }) {
  const [failed, setFailed] = useState(false);
  const photoSrc = `${import.meta.env.BASE_URL}${personalProfile.photo}`;

  if (failed) {
    return (
      <div className="personal-photo fallback" aria-label={text.personal.photoAlt}>
        <Camera size={34} />
        <strong>RY</strong>
      </div>
    );
  }

  return (
    <img
      className="personal-photo"
      src={photoSrc}
      alt={text.personal.photoAlt}
      onError={() => setFailed(true)}
    />
  );
}

function PersonalPage({ language, text }) {
  return (
    <section className="section subpage personal-page" id="personal">
      <a className="back-link" href="#top">
        <Home size={15} />
        {language === "en" ? "Home" : "Inicio"}
      </a>

      <div className="personal-layout">
        <div>
          <p className="kicker">{text.personal.kicker}</p>
          <h1>{text.personal.title}</h1>
          <p className="hero-lead">{text.personal.copy}</p>
          <p>{pick(personalProfile.intro, language)}</p>
          {(personalProfile.facts ?? []).length > 0 && (
            <div className="personal-facts">
              {personalProfile.facts.map((fact) => (
                <div key={pick(fact.label, language)}>
                  <span>{pick(fact.label, language)}</span>
                  <strong>{pick(fact.value, language)}</strong>
                </div>
              ))}
            </div>
          )}
          <div className="personal-links">
            {featureEnabled("contactButton") && (
              <a className="button secondary" href="mailto:ryali93@gmail.com">
                <Mail size={16} />
                {text.contact}
              </a>
            )}
            <a className="button subtle" href="https://www.linkedin.com/in/ryali93/">
              <Linkedin size={16} />
              LinkedIn
            </a>
          </div>
        </div>
        <PersonalPhoto text={text} />
      </div>

      <div className="personal-interests">
        <div className="section-heading compact">
          <div>
            <p className="kicker">{language === "en" ? "Interests" : "Intereses"}</p>
            <h2>{text.personal.interestsTitle}</h2>
          </div>
        </div>
        <div className="interest-grid">
          {personalProfile.interests.map((item) => (
            <article key={pick(item.title, language)} className="interest-card">
              <div className="card-icon"><Heart size={20} /></div>
              <h3>{pick(item.title, language)}</h3>
              <p>{pick(item.text, language)}</p>
            </article>
          ))}
        </div>
        <p className="personal-close">{text.personal.close}</p>
      </div>
    </section>
  );
}

function ProjectThumbnail({ project }) {
  const [failed, setFailed] = useState(false);
  const src = project.image ? `${import.meta.env.BASE_URL}${project.image}` : "";

  if (!src || failed) {
    return (
      <div className="project-thumb fallback" aria-label={project.title}>
        <Code2 size={24} />
      </div>
    );
  }

  return (
    <img
      className="project-thumb"
      src={src}
      alt={project.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ProjectsSection({ text, language }) {
  return (
    <section className="section" id="projects">
      <SectionHeading kicker={text.sections.projects.kicker} title={text.sections.projects.title}>
        {text.sections.projects.copy}
      </SectionHeading>

      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.title} className="project-card">
            <ProjectThumbnail project={project} />
            <div className="project-card-body">
              <div className="project-meta">
                <span>{field(project, "type", language)}</span>
                <span>{project.year}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{field(project, "summary", language)}</p>
              <strong>{field(project, "note", language)}</strong>
              <div className="link-row">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href}>
                    {pick(link.label, language)}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PapersSection({ text, language }) {
  return (
    <section className="section" id="papers">
      <SectionHeading kicker={text.sections.papers.kicker} title={text.sections.papers.title}>
        {text.sections.papers.copy}
      </SectionHeading>

      <div className="paper-list">
        {publications.map((paper) => (
          <a key={paper.title} className="paper-row" href={paper.href}>
            <span>{paper.venue} · {field(paper, "year", language)}</span>
            <strong>{paper.title}</strong>
            <em>{field(paper, "signal", language)}</em>
            <BookOpen size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer({ text }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>{profile.name}</strong>
        <p>{text.footer}</p>
      </div>
      <div className="footer-links">
        {profile.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const route = useRoute();
  const text = copy[language];
  useInteractiveBackground();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (route.name === "home" && hash && !hash.startsWith("#/") && hash !== "#") {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [route]);

  const mainContent =
    route.name === "blog" && pageEnabled("blog") ? (
      <BlogPage language={language} text={text} />
    ) : route.name === "blog-detail" && pageEnabled("blog") ? (
      <BlogPostDetailPage post={findBlogPost(route.slug)} language={language} text={text} />
    ) : route.name === "personal" && pageEnabled("personal") ? (
      <PersonalPage language={language} text={text} />
    ) : (
      <>
        {sectionEnabled("hero") && <Hero text={text} />}
        {sectionEnabled("education") && <EducationSection text={text} language={language} />}
        {sectionEnabled("organizations") && <OrganizationStrip />}
        {sectionEnabled("expertise") && <ExpertiseSection text={text} language={language} />}
        {sectionEnabled("mindmap") && <ExpertiseMindMap text={text} language={language} />}
        {sectionEnabled("geocv") && <GeoCvSection language={language} text={text} />}
        {sectionEnabled("projects") && <ProjectsSection text={text} language={language} />}
        {sectionEnabled("blogPreview") && pageEnabled("blog") && <BlogPreviewSection language={language} text={text} />}
        {sectionEnabled("publications") && <PapersSection text={text} language={language} />}
      </>
    );

  return (
    <div className="page-shell">
      <Header
        theme={theme}
        language={language}
        text={text}
        onThemeToggle={toggleTheme}
        onLanguageToggle={toggleLanguage}
      />
      <main>{mainContent}</main>
      <Footer text={text} />
    </div>
  );
}
