This folder holds site media for ranch/profile cards.

Structure:

  /public/site_media/<profile-id>/
    - hero.jpg
    - gallery-1.jpg
    - metadata.json

metadata.json fields:
  - profileId: string
  - title: string
  - hero: string (public path)
  - images: string[] (public paths)
  - videos: string[] (public paths)
  - coordinates: { lat: number, lng: number }

Use tools/scaffold-site-media.js to generate example folders and metadata.
