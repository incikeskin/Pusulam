const mongoose = require("mongoose");

const schema = mongoose.Schema({
    assignment: { type: mongoose.SchemaTypes.ObjectId, ref: "assignments", required: true }, // Hangi ödeve ait
    question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions", required: true }     // Hangi soru
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class AssignmentQuestions extends mongoose.Model {}

schema.loadClass(AssignmentQuestions);
module.exports = mongoose.model("assignment_questions", schema);
