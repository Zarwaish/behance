const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('#')) return;
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Missing Supabase URL/Key');
    return;
  }
  const supabase = createClient(url, key);
  
  console.log('Querying projects...');
  const { data: projects, error: projectsError } = await supabase.from('projects').select('id').limit(1);
  console.log('Projects test:', { projects, error: projectsError });

  console.log('Querying profiles...');
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles test:', { profiles, error: profilesError });
}

run();
