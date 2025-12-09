/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const INPUTS = {
  real: path.join(process.cwd(), "public", "images", "real"),
  fakes: path.join(process.cwd(), "public", "images", "fakes"),
};

const OUTPUTS = {
  real: path.join(process.cwd(), "public", "images", "real-optimized"),
  fakes: path.join(process.cwd(), "public", "images", "fakes-optimized"),
};

const MANIFEST_PATH = path.join(process.cwd(), "data", "images-manifest.json");

const VALID_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tiff",
  ".avif",
]);

const sanitizeName = (filename) =>
  path
    .parse(filename)
    .name.trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();

async function ensureEmptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function collectImages(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => VALID_EXTENSIONS.has(path.extname(name).toLowerCase()));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function optimizeSet(label, inputDir, outputDir) {
  await ensureEmptyDir(outputDir);
  const files = await collectImages(inputDir);
  const seenNames = new Set();
  const outputNames = [];

  for (const file of files) {
    const parsedName = sanitizeName(file);
    const outputName = `${parsedName}.webp`;
    if (seenNames.has(outputName)) {
      throw new Error(`Duplicate output filename detected for ${file}`);
    }
    seenNames.add(outputName);
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, outputName);

    await sharp(inputPath)
      .resize({ width: 300, height: 300, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(outputPath);

    outputNames.push(outputName);
    console.log(`[${label}] optimized -> ${outputName}`);
  }

  return outputNames;
}

async function writeManifest(real, fakes) {
  const manifestDir = path.dirname(MANIFEST_PATH);
  await fs.mkdir(manifestDir, { recursive: true });
  const payload = JSON.stringify({ real, fakes }, null, 2);
  await fs.writeFile(MANIFEST_PATH, payload);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

async function main() {
  let real = [];
  let fakes = [];
  
  try {
    real = await optimizeSet("real", INPUTS.real, OUTPUTS.real);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`[real] Input directory does not exist: ${INPUTS.real}`);
    } else {
      throw error;
    }
  }
  
  try {
    fakes = await optimizeSet("fakes", INPUTS.fakes, OUTPUTS.fakes);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`[fakes] Input directory does not exist: ${INPUTS.fakes}`);
    } else {
      throw error;
    }
  }
  
  await writeManifest(real, fakes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

