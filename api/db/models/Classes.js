const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true }, // Sınıf adı
    teacher: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true }, // Sınıf öğretmeni
    is_active: { type: Boolean, default: true }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Classes extends mongoose.Model {}

schema.loadClass(Classes);
module.exports = mongoose.model("classes", schema);
