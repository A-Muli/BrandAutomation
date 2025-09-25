import express from "express";
import fetch from "node-fetch"; // for Airtable API
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Airtable settings
const AIRTABLE_API_KEY = "YOUR_AIRTABLE_API_KEY";
const BASE_ID = "YOUR_BASE_ID";
const TABLE_NAME = "Users";

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const airtableRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          Email: email,
          Password: password, // ⚠️ Normally, hash the password before storing!
        },
      }),
    });

    const data = await airtableRes.json();
    res.json({ message: "Account created!", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving to Airtable" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
