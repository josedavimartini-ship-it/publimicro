This folder holds the FFmpeg binary/archive for local testing.

Do not commit binary archives to the repository. Instead, use the setup script to download a compatible portable FFmpeg build:

- Windows (PowerShell):
  scripts/setup-ffmpeg.ps1

- Linux/macOS: (expected to be implemented or run manual download steps)

If you need to include a binary for CI, add it to an external release or use Git LFS and configure it in the CI provider.
