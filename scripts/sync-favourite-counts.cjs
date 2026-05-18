const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: fraRows, error: fraError } = await supabase.from("fra").select("fra_id");

  if (fraError) {
    throw new Error(fraError.message);
  }

  const { data: favourites, error: favouriteError } = await supabase
    .from("favourite")
    .select("user_id, fra_id");

  if (favouriteError) {
    throw new Error(favouriteError.message);
  }

  const countByFRAId = new Map();

  for (const favourite of favourites) {
    countByFRAId.set(favourite.fra_id, (countByFRAId.get(favourite.fra_id) ?? 0) + 1);
  }

  let updated = 0;

  for (const fra of fraRows) {
    const favCount = countByFRAId.get(fra.fra_id) ?? 0;
    const { error } = await supabase
      .from("fra")
      .update({ fav_count: favCount })
      .eq("fra_id", fra.fra_id);

    if (error) {
      throw new Error(error.message);
    }

    updated += 1;
  }

  console.log(`Synced fav_count for ${updated} FRAs from ${favourites.length} favourite rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
