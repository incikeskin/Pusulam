var express = require("express");
var router = express.Router();
const StudentClasses = require("../db/models/StudentClasses");
const Users = require("../db/models/Users");
const Classes = require("../db/models/Classes");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// 🔹 Tüm endpointlerde kimlik doğrulama
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});


router.get("/", async (req, res) => {
  try {
    const studentClasses = await StudentClasses.find({})
      .populate("student", "first_name last_name email")
      .populate("class", "name");
    res.json(Response.successResponse(studentClasses));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.student)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "student field must be filled");
    if (!body.class)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "class field must be filled");

    // Aynı öğrenciyi aynı sınıfa eklemeye çalışıyorsa engelle
    const existing = await StudentClasses.findOne({ student: body.student, class: body.class });
    if (existing)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Student already in this class");

    const newRecord = await StudentClasses.create({
      student: body.student,
      class: body.class
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newRecord, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await StudentClasses.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Belirli bir sınıftaki öğrencileri listele
router.get("/list-by-class/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;

    const studentClasses = await StudentClasses.find({ class: classId })
      .populate("student", "first_name last_name email");

    res.json(Response.successResponse(studentClasses));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
