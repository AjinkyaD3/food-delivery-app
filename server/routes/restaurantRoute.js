import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import RestaurantSchema from "../models/RestaurantModel.js";

const restaurantRouter = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: uploadDir, // Folder where images will be stored
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// ✅ Add Restaurant with Image Upload
restaurantRouter.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name, cuisine, location, contact } = req.body;
        const imagePath = req.file ? path.join("uploads", req.file.filename) : null; // Store the image path safely

        const newRestaurant = new RestaurantSchema({
            name,
            cuisine: cuisine ? cuisine.split(",") : [], // Convert comma-separated string to an array
            location: location ? JSON.parse(location) : {}, // Parse JSON safely
            contact: contact ? JSON.parse(contact) : {}, // Parse JSON safely
            image: imagePath // Save image path
        });

        const savedRestaurant = await newRestaurant.save();
        res.status(201).json({ success: true, data: savedRestaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Remove Restaurant
restaurantRouter.delete("/remove/:id", async (req, res) => {
    try {
        const deletedRestaurant = await RestaurantSchema.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ List All Restaurants
restaurantRouter.get("/list", async (req, res) => {
    try {
        const restaurants = await RestaurantSchema.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Get Restaurant by ID
restaurantRouter.get("/list/:id", async (req, res) => {
    try {
        const restaurant = await RestaurantSchema.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default restaurantRouter;
