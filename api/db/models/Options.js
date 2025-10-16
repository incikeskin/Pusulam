const mongoose = require("mongoose");

const schema = mongoose.Schema({
    question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions", required: true }, // Hangi soruya ait
    text: { type: String, required: true },                                               // Şık metni
    image: { type: String }, // opsiyonel
    is_correct: { type: Boolean, default: false }                                         // Doğru şık mı
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Options extends mongoose.Model {}

schema.loadClass(Options);
module.exports = mongoose.model("options", schema);
