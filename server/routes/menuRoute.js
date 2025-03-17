import express from "express";
import Menu from "../models/Menu.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose"
const menuRouter = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/menu/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

/**
 * ✅ Add Menu for a Restaurant
 */
menuRouter.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { restaurant_id, categories, food_items } = req.body;
        if (!restaurant_id || !food_items) {
            return res.status(400).json({ success: false, message: "Restaurant ID and food items are required." });
        }

        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null; // Normalize path for cross-platform support

        let parsedFoodItems;
        try {
            parsedFoodItems = JSON.parse(food_items);
            if (!Array.isArray(parsedFoodItems)) {
                throw new Error("Food items should be an array.");
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid food items format. Must be JSON array." });
        }

        const newMenu = new Menu({
            restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
            categories: categories ? categories.split(",") : [],
            food_items: parsedFoodItems.map(item => ({
                ...item,
                image_url: imagePath || item.image_url || null // Retain previous image if not uploaded
            }))
        });

        const savedMenu = await newMenu.save();
        res.status(201).json({ success: true, data: savedMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


menuRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Convert the id to ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // ✅ Fetch menu by restaurant_id
        const menu = await Menu.findOne({ restaurant_id: objectId });

        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        res.json({ success: true, data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



/**
 * ✅ Delete Menu by Restaurant ID
 */
menuRouter.delete("/remove/:restaurant_id", async (req, res) => {
    try {
        const deletedMenu = await Menu.findOneAndDelete({ restaurant_id: req.params.restaurant_id });
        if (!deletedMenu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }
        res.json({ success: true, message: "Menu deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * ✅ Serve Uploaded Menu Images
 */
menuRouter.use("/uploads/menu", express.static(path.join(process.cwd(), "uploads/menu")));

export default menuRouter;
