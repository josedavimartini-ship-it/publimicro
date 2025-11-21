Cleanup actions performed

- Date: 2025-11-19
- Scope: safe, non-destructive cleanup to free disk/RAM pressure on low-memory machines (4 GB RAM).
- What I removed (only):
  - Old `*.log` files throughout the workspace (build logs, supabase logs, turbo logs, etc.).
  - Known artifact folders where present: `tools/playwright-smoke/artifacts`, `artifacts`, `tmp`, `temp` (only if present).
- What I did NOT remove:
  - `node_modules` or any dependencies
  - source files under `apps/` or `packages/`
  - `.git` or lockfiles (`pnpm-lock.yaml`)
  - anything that could break builds or your work

Backups

- Backups of removed files and extensions (where applicable) are stored under your temporary folder `%TEMP%`.
- Backup folders created during this session (example paths):
  - `C:\Users\Usuario\AppData\Local\Temp\publimicro-cleanup-20251119-181707` (log/artifact backup)
  - `C:\Users\Usuario\AppData\Local\Temp\vscode-ext-backup-20251119-181929` (moved VS Code extensions)
  - There may be additional similar folders with other timestamps; check `%TEMP%` for `publimicro-cleanup-*` and `vscode-ext-backup-*`.

How to restore backed-up VS Code extensions

- If you want to restore a moved extension, copy or move the folder from the backup location back into:

  `%USERPROFILE%\.vscode\extensions\`

- Example PowerShell command (run in a PowerShell prompt):

```powershell
$backup = "C:\Users\Usuario\AppData\Local\Temp\vscode-ext-backup-20251119-181929"
Copy-Item -Path "$backup\github.copilot-1.388.0" -Destination "$env:USERPROFILE\.vscode\extensions\" -Recurse -Force
```

Note: If VS Code is running while you restore, you may need to restart it to detect the restored extension.

Low-memory workflow recommendations (4 GB RAM)

1) Close VS Code and other heavy processes (Chrome, Docker) while doing installs/builds.

2) Prefer selective installs per workspace instead of installing the entire monorepo at once. Example: install only `apps/publimicro` and its dependencies:

```powershell
# Reduce pnpm concurrency to limit memory
$env:PNPM_NETWORK_CONCURRENCY = '1'
# Install only the publimicro app workspace and dependencies
pnpm --filter "./apps/publimicro..." install
```

3) If you need only to run the app (not develop), install production deps only:

```powershell
pnpm --filter "./apps/publimicro..." install --prod
```

4) If a package from `packages/` needs building (e.g., `@publimicro/ui`) build it alone to avoid building the entire repo:

```powershell
pnpm turbo build --filter=@publimicro/ui
```

5) Start VS Code with extensions disabled (temporary) if the editor itself is consuming too much RAM. If `code` CLI is available:

```powershell
code --disable-extensions
```

If the `code` command is not in PATH, open VS Code and use the Command Palette → "Disable All Installed Extensions".

6) If installs still OOM, consider temporarily increasing Windows virtual memory (pagefile) or using a remote dev machine (Codespaces, dev VM).

Notes & Safety

- All removals in this session were limited to logs and artifacts. No dependencies were removed.
- If any removal failed due to file locks or permissions, the original file has been left in place and is reported in the session output.
- If you want a more aggressive cleanup (remove `node_modules`), I can do it but you'll need to re-run `pnpm install` selectively afterward.

If you want me to:
- Restore any extension from the backup, say: `restore extension <name>` (e.g. `restore extension github.copilot-1.388.0`).
- Run the aggressive cleanup now, say: `run aggressive cleanup` (I'll not delete node_modules until you confirm and will warn about reinstallation steps).

Thank you — tell me which next step you prefer.