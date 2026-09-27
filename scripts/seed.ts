// The app seeds itself automatically on first boot (see src/lib/db/index.ts),
// so this script exists mainly for explicitly running that step outside the
// dev server, e.g. right after cloning the repo, before the first `npm run dev`.
import "../src/lib/db";

console.log("Database ready (created and seeded if it was empty).");
