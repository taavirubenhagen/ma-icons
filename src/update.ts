import fs from "fs";
import path from "path";
import { icon } from "../src/icon.ts";

const ICONS_DIR = path.resolve("icons");
const OUTPUT_FILE = path.resolve("src/names.txt");

generateIconList();
//await generateCombinedFiles();
//generateIconList();

function generateIconList() {
  console.log("Generating icon list");
  const files = fs.readdirSync(ICONS_DIR);
  const iconNames = files
    .filter((f) => f.endsWith(".svg"))
    .map((f) => path.basename(f, ".svg"))
    .sort();
  fs.writeFileSync(OUTPUT_FILE, iconNames.join(","));
  console.log("List written to names.txt");
}

export async function generateCombinedFiles() {
  console.log("Fetching icon names");
  const buffer = fs.readFileSync(OUTPUT_FILE);
  const names = buffer.toString().split(",").filter((e) => !e.includes("-"));
  console.log("Generating combined icons from list:");
  console.log(names);
  for (let primary of names) {
    for (let secondary of names) {
      const id = primary + "-" + secondary;
      console.log("Generating for icon " + id);
      const content = await icon(id, false);
      fs.writeFileSync(path.resolve("./icons/" + id + ".svg"), content);
    }
  }
}
