const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 10000;

const DATA_FILE = path.resolve(__dirname, "../Frontend/JSON/plants_data.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PUBLIC_DIR = path.resolve(__dirname, "../");
app.use(express.static(PUBLIC_DIR));

console.log("Data file path:", DATA_FILE);

app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "/Frontend/HTML/home.html"));
});

app.get("/plants", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).json({ error: "Failed to read data file" });
        }
        res.json(JSON.parse(data));
    });
});

app.post("/plants", (req, res) => {
    const newPlant = req.body;

    console.log("Received data:", newPlant);

    if (!newPlant.common_name || !newPlant.traditional_uses) {
        return res.status(400).json({ error: "Missing fields" });
    }

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read data file" });
        }

        let plants = [];
        try {
            plants = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).json({ error: "Invalid JSON format in data file" });
        }

        plants.push(newPlant);

        fs.writeFile(DATA_FILE, JSON.stringify(plants, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ error: "Failed to save data" });
            }
            res.status(201).json({ message: "Plant added successfully", plant: newPlant });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
