import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "images");
const METADATA_DIR = path.join(__dirname, "metadata");

const NFTs = [
  { id: 1, name: "Cosmic Drifter",  color: "#6366f1", bg: "#1e1b4b", trait: "Space",  rarity: "Rare"      },
  { id: 2, name: "Ember Wraith",    color: "#f97316", bg: "#431407", trait: "Fire",   rarity: "Epic"      },
  { id: 3, name: "Verdant Specter", color: "#22c55e", bg: "#052e16", trait: "Forest", rarity: "Common"    },
  { id: 4, name: "Frozen Oracle",   color: "#38bdf8", bg: "#082f49", trait: "Ice",    rarity: "Uncommon"  },
  { id: 5, name: "Void Sovereign",  color: "#a855f7", bg: "#2e1065", trait: "Void",   rarity: "Legendary" },
];

console.log("📸 Generating PNG images via Sharp...");
mkdirSync(IMAGES_DIR, { recursive: true });

for (const nft of NFTs) {
  // Build the SVG string exactly as before
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <radialGradient id="bg${nft.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${nft.color}33"/>
      <stop offset="100%" stop-color="${nft.bg}"/>
    </radialGradient>
    <radialGradient id="orb${nft.id}" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="${nft.color}ff"/>
      <stop offset="60%" stop-color="${nft.color}99"/>
      <stop offset="100%" stop-color="${nft.color}11"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg${nft.id})"/>
  <circle cx="250" cy="230" r="160" fill="none" stroke="${nft.color}" stroke-width="1" opacity="0.2"/>
  <circle cx="250" cy="230" r="120" fill="none" stroke="${nft.color}" stroke-width="1" opacity="0.3"/>
  <circle cx="250" cy="230" r="80"  fill="none" stroke="${nft.color}" stroke-width="1.5" opacity="0.4"/>
  <circle cx="250" cy="230" r="70" fill="url(#orb${nft.id})" opacity="0.9"/>
  <circle cx="250" cy="230" r="70" fill="none" stroke="${nft.color}" stroke-width="2"/>
  <circle cx="225" cy="205" r="18" fill="white" opacity="0.15"/>
  <text x="250" y="360" font-family="monospace" font-size="14" fill="${nft.color}" text-anchor="middle" opacity="0.7">#${String(nft.id).padStart(4,"0")}</text>
  <text x="250" y="400" font-family="monospace" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${nft.name}</text>
  <text x="250" y="430" font-family="monospace" font-size="13" fill="${nft.color}" text-anchor="middle" opacity="0.8">${nft.rarity}</text>
  <rect x="20" y="20" width="40" height="2" fill="${nft.color}" opacity="0.5"/>
  <rect x="20" y="20" width="2" height="40" fill="${nft.color}" opacity="0.5"/>
  <rect x="440" y="20" width="40" height="2" fill="${nft.color}" opacity="0.5"/>
  <rect x="478" y="20" width="2" height="40" fill="${nft.color}" opacity="0.5"/>
  <rect x="20" y="478" width="40" height="2" fill="${nft.color}" opacity="0.5"/>
  <rect x="20" y="460" width="2" height="40" fill="${nft.color}" opacity="0.5"/>
  <rect x="440" y="478" width="40" height="2" fill="${nft.color}" opacity="0.5"/>
  <rect x="478" y="460" width="2" height="40" fill="${nft.color}" opacity="0.5"/>
</svg>`;

  // Convert SVG → PNG using Sharp (avoids all browser SVG CORS issues)
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(IMAGES_DIR, `${nft.id}.png`));

  console.log(`  ✓ images/${nft.id}.png`);
}

// Upload images
console.log("\n📤 Uploading images to local IPFS...");
const imagesCid = execSync(`ipfs add -r -Q "${IMAGES_DIR}"`).toString().trim();
console.log(`  ✓ Images CID: ${imagesCid}`);

// Generate metadata — note the .png extension now
mkdirSync(METADATA_DIR, { recursive: true });

for (const nft of NFTs) {
  const metadata = {
    name: nft.name,
    description: `${nft.name} is a ${nft.rarity.toLowerCase()} NFT. Trait: ${nft.trait}.`,
    image: `ipfs://${imagesCid}/${nft.id}.png`,   // ← .png now
    attributes: [
      { trait_type: "Element", value: nft.trait },
      { trait_type: "Rarity",  value: nft.rarity },
      { trait_type: "Token ID", value: nft.id },
    ],
  };
  writeFileSync(path.join(METADATA_DIR, `${nft.id}`), JSON.stringify(metadata, null, 2));
  console.log(`  ✓ metadata/${nft.id}`);
}

console.log("\n📤 Uploading metadata to local IPFS...");
const metadataCid = execSync(`ipfs add -r -Q "${METADATA_DIR}"`).toString().trim();
console.log(`  ✓ Metadata CID: ${metadataCid}`);

console.log(`
✅ Done! Paste this into your deploy script:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
baseTokenURI = "ipfs://${metadataCid}/"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify:
  http://127.0.0.1:8080/ipfs/${metadataCid}/1
  http://127.0.0.1:8080/ipfs/${imagesCid}/1.png
`);