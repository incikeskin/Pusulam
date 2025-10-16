const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String, required: true },          // Ödev başlığı
    description: { type: String },                    // Ödev açıklaması
    class: { type: mongoose.SchemaTypes.ObjectId, ref: "classes", required: true },  // Hangi sınıfa ait
    teacher: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },  // Hangi öğretmen verdi
    due_date: { type: Date },                         // Son teslim tarihi
    is_active: { type: Boolean, default: true }       // Ödev aktif mi
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Assignments extends mongoose.Model {}

schema.loadClass(Assignments);
module.exports = mongoose.model("assignments", schema);
