import fs from "fs/promises";
import path from "path";

const WEIGHT = 5;

export async function icon(id: string, isChild: boolean): Promise<string> {
  const ids = id.split("-");
  const name = isChild ? ids[1] : ids[0];
  const offset = isChild ? "32" : "0";
  const weight = (WEIGHT * (isChild ? 2 : 1)).toString();

  const load = async (n: string): Promise<string> => {
    const file = path.resolve(process.cwd(), "../icons", `${n}.svg`);
    return fs.readFile(file, "utf8");
  };

  let svg = await load(name);
  svg = svg.replace(
    /<svg\b([^>]*)>/,
    `<svg$1 x="${offset}" y="${offset}">`,
  );
  svg = svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${weight}"`);
  if (ids[1] && !isChild) {
    svg = await applyChild(svg, id);
  }
  return svg;
}

async function applyChild(
  parentSvg: string,
  id: string,
): Promise<string> {
  const mask = `
<defs>
  <mask id="quarterMask">
    <rect width="64" height="64" fill="white"/>
    <rect x="32" y="32" width="32" height="32" fill="black"/>
  </mask>
</defs>
`;

  // inject defs right after <svg>
  parentSvg = parentSvg.replace(
    /<svg\b[^>]*>/,
    (m) => m + mask,
  );

  // apply mask to drawable elements
  parentSvg = parentSvg.replace(
    /<(path|rect|circle|line|polygon|polyline)\b/g,
    `<$1 mask="url(#quarterMask)"`,
  );

  // load child SVG as string
  const childSvg = await icon(id, true);

  // extract inner content of child <svg>
  const inner = childSvg.replace(/<\/?svg\b[^>]*>/g, "");

  // wrap in group with scale + translate to bottom-left
  const transformed = `<g transform="translate(32,32) scale(0.5)">
${inner}
</g>`;

  // append child before closing parent </svg>
  parentSvg = parentSvg.replace(/<\/svg>/, `${transformed}</svg>`);

  return parentSvg;
}
