const fs = require('fs');
const path = require('path');

// Helper to scaffold site_media folders for ranch profiles and example metadata
// Run from repo root: node tools/scaffold-site-media.js

const OUT = path.resolve(__dirname, '../apps/publimicro/public/site_media');
const PROFILE_COUNT = 6;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(OUT);

for (let i = 1; i <= PROFILE_COUNT; i++) {
  const id = `profile-${i}`;
  const dir = path.join(OUT, id);
  ensureDir(dir);

  // example placeholder paths (you should replace images/videos with real files)
  const metadata = {
    profileId: id,
    title: `Sítio ${i} - Exemplo`,
    hero: `/site_media/${id}/hero.jpg`,
    images: [`/site_media/${id}/hero.jpg`, `/site_media/${id}/gallery-1.jpg`],
    videos: [],
    coordinates: { lat: -15.000 + i * 0.01, lng: -47.000 + i * 0.01 },
    contact: {
      phone: null,
      owner: null
    }
  };

  const metaPath = path.join(dir, 'metadata.json');
  if (!fs.existsSync(metaPath)) {
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log('Wrote', metaPath);
  } else {
    console.log('Exists', metaPath);
  }

  // write a README to each folder explaining usage
  const readme = `This folder contains media for ${id}.
Place hero.jpg, gallery images, and video files here.
Edit metadata.json to update title, images, videos and coordinates.
`;
  const readmePath = path.join(dir, 'README.md');
  if (!fs.existsSync(readmePath)) fs.writeFileSync(readmePath, readme);
}

// Top-level README
const topReadme = `Public site_media structure

Place per-profile media under /public/site_media/<profile-id>/
Each folder should have a metadata.json with the following shape:

{
  "profileId": "profile-1",
  "title": "Sítio Exemplo",
  "hero": "/site_media/profile-1/hero.jpg",
  "images": ["/site_media/profile-1/hero.jpg"],
  "videos": [],
  "coordinates": { "lat": -15.0, "lng": -47.0 }
}

Run this script to create example folders: node tools/scaffold-site-media.js
`;
const topPath = path.join(OUT, 'README.md');
if (!fs.existsSync(topPath)) fs.writeFileSync(topPath, topReadme);

console.log('Scaffold complete. Site media base:', OUT);
