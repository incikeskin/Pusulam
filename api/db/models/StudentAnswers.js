const mongoose = require("mongoose");

const schema = mongoose.Schema({
    student: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },          // Öğrenci
    assignment: { type: mongoose.SchemaTypes.ObjectId, ref: "assignments", required: true }, // Ödev
    question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions", required: true },     // Soru
    selected_option: { type: mongoose.SchemaTypes.ObjectId, ref: "options" },                // Öğrencinin seçtiği 
    is_correct: { type: Boolean },                                                           // Doğru mu yanlış mı
    answered_at: { type: Date, default: Date.now }                                           // Cevap tarihi
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class StudentAnswers extends mongoose.Model {}

schema.loadClass(StudentAnswers);
module.exports = mongoose.model("student_answers", schema);
