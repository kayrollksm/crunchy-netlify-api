// netlify/functions/pendaftar.js

const { createClient } = require("@supabase/supabase-js");

// ENV dari Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS setup
const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all for now
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK"
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed"
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { nama, telefon, email, referral } = data;

    if (!nama || !telefon || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Data tak lengkap" })
      };
    }

    const insert = await supabase.from("pendaftar").insert([
      {
        nama,
        telefon,
        email,
        referral
      }
    ]);

    if (insert.error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: insert.error.message })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Berjaya daftar" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
