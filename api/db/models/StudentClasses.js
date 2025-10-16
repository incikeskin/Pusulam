const mongoose = require("mongoose");

const schema = mongoose.Schema({
    student: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },
    class: { type: mongoose.SchemaTypes.ObjectId, ref: "classes", required: true }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class StudentClasses extends mongoose.Model {}

schema.loadClass(StudentClasses);
module.exports = mongoose.model("student_classes", schema);
