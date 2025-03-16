import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    cuisine: [{ type: String, required: true }],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    contact: {
        phone: { type: String },
        email: { type: String },
        website: { type: String }
    },
    image: { type: String }, // ✅ Add Image Path Field
    rating: { type: Number, default: 0 }, // Example: 4.5
    is_open: { type: Boolean, default: true }, // Open/Closed status
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Restaurant", RestaurantSchema);
