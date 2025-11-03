var express = require("express");
var router = express.Router();
const StudentAnswers = require("../db/models/StudentAnswers");
const Assignments = require("../db/models/Assignments");
const Questions = require("../db/models/Questions");
const Options = require("../db/models/Options");
const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// 🔹 Tüm endpointlerde kimlik doğrulama
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});


// ✅ 1. Cevap ekle
router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.student)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "student field must be filled");
    if (!body.assignment)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "assignment field must be filled");
    if (!body.question)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "question field must be filled");
    if (!body.selected_option)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "selected_option field must be filled");

    // 🔍 Seçilen şıkkı bul ve doğru mu yanlış mı kontrol et
    const option = await Options.findById(body.selected_option);
    if (!option)
      throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Not Found", "Selected option not found");

    // 🔹 Doğruluk durumunu options tablosundan otomatik al
    const isCorrect = option.is_correct;

    // 🧠 Aynı soruya tekrar cevap verilmişse, eski cevabı güncelle
    const existingAnswer = await StudentAnswers.findOne({
      student: body.student,
      assignment: body.assignment,
      question: body.question
    });

    let result;
    if (existingAnswer) {
      existingAnswer.selected_option = body.selected_option;
      existingAnswer.is_correct = isCorrect;
      existingAnswer.answered_at = Date.now();
      await existingAnswer.save();
      result = existingAnswer;
    } else {
      result = await StudentAnswers.create({
        student: body.student,
        assignment: body.assignment,
        question: body.question,
        selected_option: body.selected_option,
        is_correct: isCorrect
      });
    }

    res
      .status(Enum.HTTP_CODES.CREATED)
      .json(Response.successResponse(result, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


// ✅ 2. Cevap sil
router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await StudentAnswers.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


// ✅ 3. Öğrencinin bir ödevdeki tüm cevaplarını getir
router.get("/list-by-student/:assignmentId/:studentId", async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const answers = await StudentAnswers.find({
      assignment: assignmentId,
      student: studentId
    })
      .populate("question", "text image")
      .populate("selected_option", "text is_correct");

    res.json(Response.successResponse(answers));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


// ✅ 4. Öğrencinin ödev sonucunu getir (doğru, yanlış, yüzde)
router.get("/result/:assignmentId/:studentId", async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const answers = await StudentAnswers.find({
      assignment: assignmentId,
      student: studentId
    });

    if (!answers.length)
      throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Not Found", "No answers found for this student");

    const total = answers.length;
    const correct = answers.filter(a => a.is_correct === true).length;

    res.json(Response.successResponse({
      assignment: assignmentId,
      student: studentId,
      total,
      correct,
      incorrect: total - correct,
      score_percent: Math.round((correct / total) * 100)
    }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
