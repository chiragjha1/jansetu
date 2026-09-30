import fs from "fs";
import path from "path";

console.log("Validating state configurations and scheme catalogs...");

const configDir = path.join(process.cwd(), "config", "states");
const schemesFile = path.join(process.cwd(), "data", "schemes.json");

if (!fs.existsSync(configDir)) {
  throw new Error("Missing config/states directory");
}

const stateFiles = fs.readdirSync(configDir).filter((f) => f.endsWith(".json"));
console.log(`Found ${stateFiles.length} state configs:`, stateFiles);

for (const file of stateFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(configDir, file), "utf-8"));
  console.log(`- State [${data.id}]: ${data.name} (${data.language_name}) with ${data.districts.length} districts.`);
}

if (!fs.existsSync(schemesFile)) {
  throw new Error("Missing data/schemes.json");
}

const schemes = JSON.parse(fs.readFileSync(schemesFile, "utf-8"));
console.log(`Found ${schemes.length} schemes in catalog:`, schemes.map((s: any) => s.id).join(", "));

console.log("Seed data validation complete.");
