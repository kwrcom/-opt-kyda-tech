This folder contains timestamped archives of vendored frontend dependencies which were removed from the active app folders to keep the repository clean.

Why:
- Many npm packages were accidentally committed into `frontend/bank-app` and `frontend/landing` (not under node_modules/). Those large trees pollute the repo and make history noisy.

How to recover:
1. If you need to restore an archive for inspection or to restore the previous state, copy the archived folder back into the app directory (e.g. `cp -r bank-app-vendor-YYYYMMDD-HHMMSS ../bank-app/`).
2. Then commit the change on a temporary branch before making further edits.

Recommended workflow:
- Keep `package.json` and `package-lock.json` in the app directory.
- Run `npm ci` or `npm install` from the app directory (when `node_modules/` is absent) to recreate required packages.

If you find any customized vendor packages that were intentionally modified inside these vendored trees, please open an issue or contact the team so we can review and recover any needed changes.
