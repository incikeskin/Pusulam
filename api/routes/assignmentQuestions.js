var express = require("express");
var router = express.Router();
const AssignmentQuestions = require("../db/models/AssignmentQuestions");
const Assignments = require("../db/models/Assignments");
const Questions = require("../db/models/Questions");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// 🔹 Tüm endpointlerde kimlik doğrulama
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

//  Tüm assignment-question kayıtlarını listele
router.get("/", async (req, res) => {
  try {
    const records = await AssignmentQuestions.find({})
      .populate("assignment", "title")
      .populate("question", "text");

    res.json(Response.successResponse(records));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Ödeve soru ekle
router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.assignment)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "assignment field must be filled");
    if (!body.question)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "question field must be filled");

    // Aynı sorunun aynı ödevde tekrar eklenmesini engelle
    const existing = await AssignmentQuestions.findOne({
      assignment: body.assignment,
      question: body.question
    });
    if (existing)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "This question already added to this assignment");

    const newRecord = await AssignmentQuestions.create({
      assignment: body.assignment,
      question: body.question
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newRecord, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Kayıt sil (ödev-soru ilişkisini kaldır)
router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await AssignmentQuestions.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

//Belirli bir ödevdeki tüm soruları listele
router.get("/list-by-assignment/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    const records = await AssignmentQuestions.find({ assignment: assignmentId })
      .populate("question", "text");

    res.json(Response.successResponse(records));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
