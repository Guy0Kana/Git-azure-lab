require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("Missing OPENWEATHER_API_KEY in .env");
  process.exit(1);
}

// Serve the front-end files
app.use(express.static(path.join(__dirname, "public")));

// Forwards a request to OpenWeatherMap, adding the secret key server-side
async function proxy(endpoint, req, res) {
  const city = (req.query.q || "").toString().trim();
  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  url.searchParams.set("q", city);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", API_KEY);

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error(`Error calling ${endpoint}:`, err);
    res.status(502).json({ message: "Weather service unavailable" });
  }
}

app.get("/api/weather", (req, res) => proxy("weather", req, res));
app.get("/api/forecast", (req, res) => proxy("forecast", req, res));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});