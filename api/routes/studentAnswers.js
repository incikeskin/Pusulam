var express = require("express");
var router = express.Router();
const StudentAnswers = require("../db/models/StudentAnswers");
const AssignmentQuestions = require("../db/models/AssignmentQuestions");
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


//  Cevap ekle
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


// Cevap sil
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


//Öğrencinin bir ödevdeki tüm cevaplarını getir
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


//  Öğrencinin ödev sonucunu getir (doğru, yanlış, yüzde)
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

//  Belirli bir sınıftaki öğrencinin tüm ödevlerinden genel rating hesapla
router.get("/overall-rating/:classId/:studentId", async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // 1️⃣ O sınıfa verilen tüm ödevleri getir
    const assignments = await Assignments.find({ class: classId }).select("_id");
    if (!assignments.length)
      throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Not Found", "No assignments found for this class");

    const assignmentIds = assignments.map(a => a._id);

    // 2️⃣ O ödevlerdeki tüm soruları getir
    const assignmentQuestions = await AssignmentQuestions.find({
      assignment: { $in: assignmentIds }
    }).select("assignment question");

    const totalQuestions = assignmentQuestions.length;

    // 3️⃣ Öğrencinin verdiği cevapları getir (sadece bu ödevler için)
    const studentAnswers = await StudentAnswers.find({
      assignment: { $in: assignmentIds },
      student: studentId
    }).select("assignment question is_correct");

    // 4️⃣ Doğru sayısını hesapla
    let totalCorrect = 0;
    assignmentQuestions.forEach(aq => {
      const answer = studentAnswers.find(sa => sa.question.toString() === aq.question.toString());
      if (answer && answer.is_correct) totalCorrect += 1;
      // cevap yoksa zaten yanlış sayılıyor
    });

    const scorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    res.json(Response.successResponse({
      student: studentId,
      class: classId,
      totalQuestions,
      totalCorrect,
      totalIncorrect: totalQuestions - totalCorrect,
      score_percent: scorePercent
    }));

  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


module.exports = router;
