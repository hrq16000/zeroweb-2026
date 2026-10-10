/**
 * Validação build-time da renderização responsiva de novos portfolios v4.
 *
 * O gerador WebP (prebuild) já deve ter rodado quando este gate executa.
 * Nenhuma página, asset ou import JSX é alterado; só são validados os
 * PortfolioImage com src/widths literais e as prioridades de LCP.
 *
 * O uso dinâmico de src/widths sem contrato verificável não é aceito quando
 * widths está presente — evita srcset apontando para 404 em produção.
 */
import { existsSync } from "node:fs";

const IMAGE_TAG = /<PortfolioImage\b([^>]*)>/gs;
const RAW_TAG = /<img\b([^>]*)>/gs;
const MIN_WIDTH = 64;
const MAX_WIDTH = 2400;

function hasAttr(attrs, attr) {
  return new RegExp(`(?:^|\\s)${attr}\\s*=`).test(attrs);
}

function staticSrc(attrs) {
  return attrs.match(/(?:^|\s)src\s*=\s*(["'])([^"'<>]+)\1/)?.[2] ?? null;
}

function widthsFrom(attrs) {
  if (!hasAttr(attrs, "widths")) return { present: false, values: [] };
  const m = attrs.match(/(?:^|\s)widths\s*=\s*\{\s*\[([^\]]*)\]\s*\}/);
  if (!m) return { present: true, error: "widths deve ser lista literal [480, 960] para validacao" };
  const tokens = m[1].split(",").map((t) => t.trim()).filter(Boolean);
  if (!tokens.length || tokens.some((t) => !/^[0-9]+$/.test(t))) {
    return { present: true, error: "widths invalida: informe inteiros positivos" };
  }
  const values = tokens.map(Number);
  if (values.length > 6 || values.some((v) => !Number.isSafeInteger(v) || v < MIN_WIDTH || v > MAX_WIDTH)
    || values.some((v, i) => i > 0 && v <= values[i - 1])) {
    return { present: true, error: "widths deve ter inteiros crescentes de 64 a 2400, sem repeticao (maximo 6)" };
  }
  return { present: true, values };
}

function priorityFrom(attrs) {
  const token = attrs.match(/(?:^|\s)priority(?=\s|=|\/|$)(?:\s*=\s*(\{[^}]*\}|["'][^"']*["']))?/);
  if (!token) return { active: false };
  const literal = token[1];
  if (literal === undefined || literal === "{true}") return { active: true };
  if (literal === "{false}") return { active: false };
  return { active: false, error: "priority deve ser booleano literal para verificar LCP" };
}

function localImagePath(slug, src) {
  const clean = src.split(/[?#]/, 1)[0];
  const allowed = [`/images/${slug}/`, `/images/_generated/${slug}/`];
  if (!allowed.some((prefix) => clean.startsWith(prefix))) return null;
  const remainder = clean.slice(allowed.find((prefix) => clean.startsWith(prefix)).length);
  if (!remainder || !/^[a-zA-Z0-9_./ -]+$/.test(remainder)
      || remainder.split("/").some((segment) => !segment || segment === "." || segment === "..")) return null;
  return `public${clean}`;
}

function responsiveVariant(src, width) {
  return src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, `-${width}$1$2`);
}

export function checkNewPortfolioImagePerformance(slug, source, exists = existsSync) {
  const errors = [];
  let lcpCandidates = 0;

  for (const match of source.matchAll(IMAGE_TAG)) {
    const attrs = match[1];
    const line = source.slice(0, match.index).split("\n").length;
    const label = `[PORTFOLIO_LCP_GATE] ${slug} PortfolioImage linha ${line}`;
    // PortfolioImage espalha props depois do srcSet calculado; impedir que
    // atributos manuais ou spread sobrescrevam as garantias do componente.
    if (/(?:^|\s)srcSet\s*=/.test(attrs)) errors.push(`${label}: srcSet manual nao e permitido em v4; use widths verificados`);
    if (/(?:^|\s)fetchPriority\s*=/.test(attrs)) errors.push(`${label}: fetchPriority manual pode sobrescrever a prioridade do LCP`);
    if (/\{\s*\.\.\./.test(attrs)) errors.push(`${label}: props spread impedem validacao estatica de LCP/srcset`);
    const priority = priorityFrom(attrs);
    if (priority.error) errors.push(`${label}: ${priority.error}`);
    if (priority.active) lcpCandidates++;

    const widths = widthsFrom(attrs);
    if (!widths.present) continue;
    if (widths.error) { errors.push(`${label}: ${widths.error}`); continue; }
    const src = staticSrc(attrs);
    if (!src) {
      errors.push(`${label}: widths requer src literal do proprio portfolio; src dinamico exige gate especifico`);
      continue;
    }
    if (src.includes("#")) errors.push(`${label}: fragmento de URL nao suportado com widths`);
    const base = localImagePath(slug, src);
    if (!base) {
      errors.push(`${label}: src com widths precisa estar em /images/${slug}/ ou /images/_generated/${slug}/`);
      continue;
    }
    if (!exists(base)) errors.push(`${label}: imagem base nao encontrada: ${base}`);
    for (const width of widths.values) {
      const variant = responsiveVariant(src, width);
      const relative = localImagePath(slug, variant);
      if (!relative || !exists(relative)) {
        errors.push(`${label}: srcset aponta para variante ausente ${variant} (${width}w)`);
      }
    }
  }

  for (const match of source.matchAll(RAW_TAG)) {
    const attrs = match[1];
    if (!/(?:^|\s)loading\s*=\s*["']eager["']/.test(attrs)) continue;
    lcpCandidates++;
    const line = source.slice(0, match.index).split("\n").length;
    if (!/(?:^|\s)fetchPriority\s*=\s*["']high["']/.test(attrs)) {
      errors.push(`[PORTFOLIO_LCP_GATE] ${slug} img linha ${line}: loading=eager requer fetchPriority="high"`);
    }
  }

  if (lcpCandidates > 1) {
    errors.push(`[PORTFOLIO_LCP_GATE] ${slug}: ${lcpCandidates} imagens LCP (eager/priority), maximo permitido 1`);
  }
  return errors;
}
