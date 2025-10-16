const mongoose = require("mongoose");

const schema = mongoose.Schema({
    text: { type: String, required: true },                  // Sorunun metni
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },  // Opsiyonel: kategori
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }, // Zorluk seviyesi
    image: { type: String }, // opsiyonel
    is_active: { type: Boolean, default: true }              // Sorunun kullanılabilirliği
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Questions extends mongoose.Model {}

schema.loadClass(Questions);
module.exports = mongoose.model("questions", schema);
