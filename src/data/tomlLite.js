function setPath(target, path, value) {
  const parts = path.split(".");
  let current = target;
  parts.slice(0, -1).forEach((part) => {
    current[part] = current[part] ?? {};
    current = current[part];
  });
  current[parts[parts.length - 1]] = value;
}

function parseArray(value) {
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((item) => item.trim())
    .map(parseTomlValue);
}

export function parseTomlValue(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return parseArray(trimmed);
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseTomlLite(source) {
  const data = {};
  let context = data;
  let section = "";
  let inHtmlComment = false;

  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (inHtmlComment) {
      if (trimmed.includes("-->")) inHtmlComment = false;
      return;
    }
    if (trimmed.startsWith("<!--")) {
      if (!trimmed.includes("-->")) inHtmlComment = true;
      return;
    }
    if (!trimmed || trimmed.startsWith("#")) return;

    const arrayMatch = trimmed.match(/^\[\[([A-Za-z0-9_.-]+)\]\]$/);
    if (arrayMatch) {
      const key = arrayMatch[1];
      data[key] = data[key] ?? [];
      const item = {};
      data[key].push(item);
      context = item;
      section = "";
      return;
    }

    const sectionMatch = trimmed.match(/^\[([A-Za-z0-9_.-]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1];
      data[section] = data[section] ?? {};
      context = data[section];
      return;
    }

    const assignment = trimmed.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.*)$/);
    if (!assignment) return;

    const [, rawKey, rawValue] = assignment;
    const value = parseTomlValue(rawValue);
    if (context !== data) {
      setPath(context, rawKey, value);
    } else if (section) {
      setPath(data[section], rawKey, value);
    } else {
      setPath(data, rawKey, value);
    }
  });

  return data;
}
