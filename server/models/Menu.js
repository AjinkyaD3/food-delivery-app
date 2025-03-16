import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    categories: [{ type: String, required: true }],
    food_items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            category: { type: String, required: true },
            is_available: { type: Boolean, default: true },
            description: { type: String },
            image_url: { type: String }
        }
    ],
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Menu", MenuSchema);
