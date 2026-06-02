const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:Redraft@rahul@db.rqcknjladbfefkcmfkkh.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    
    // Set building-rest-apis-with-express to published
    await client.query("UPDATE posts SET status = 'published' WHERE slug = 'building-rest-apis-with-express'");
    console.log("Successfully set Bob's article 'building-rest-apis-with-express' to published.");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
