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
const StudentClasses = require("../db/models/StudentClasses");

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

// 📊 SINIF ORTALAMASI + SIRALAMA (TEK ÖDEV)
router.get("/class-ranking/:assignmentId/:classId/:studentId", async (req, res) => {
  try {
    const { assignmentId, classId, studentId } = req.params;

    // 1️⃣ Sınıftaki öğrencileri al
    const studentClasses = await StudentClasses.find({ class: classId })
        .select("student");

    if (!studentClasses.length) {
      throw new CustomError(
          Enum.HTTP_CODES.NOT_FOUND,
          "Not Found",
          "No students in class"
      );
    }

    const studentIds = studentClasses.map(sc => sc.student.toString());

    // 2️⃣ Bu ödev için tüm cevapları çek
    const answers = await StudentAnswers.find({
      assignment: assignmentId,
      student: { $in: studentIds }
    });

    if (!answers.length) {
      throw new CustomError(
          Enum.HTTP_CODES.NOT_FOUND,
          "Not Found",
          "No answers found for this assignment"
      );
    }

    // 3️⃣ Öğrenci bazlı skorları hesapla
    const scoreMap = {};

    answers.forEach(answer => {
      const sid = answer.student.toString();

      if (!scoreMap[sid]) {
        scoreMap[sid] = { correct: 0, total: 0 };
      }

      scoreMap[sid].total += 1;
      if (answer.is_correct) scoreMap[sid].correct += 1;
    });

    const scores = Object.entries(scoreMap).map(([student, data]) => ({
      student,
      score: Math.round((data.correct / data.total) * 100)
    }));

    // 4️⃣ Sıralama (yüksekten düşüğe)
    scores.sort((a, b) => b.score - a.score);

    // 5️⃣ Öğrencinin sırası
    const rankIndex = scores.findIndex(
        s => s.student.toString() === studentId
    );

    if (rankIndex === -1) {
      throw new CustomError(
          Enum.HTTP_CODES.NOT_FOUND,
          "Not Found",
          "Student not ranked for this assignment"
      );
    }

    const rank = rankIndex + 1;

    // 6️⃣ Sınıf ortalaması
    const classAverage = Math.round(
        scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    );

    res.json(Response.successResponse({
      studentId,
      studentScore: scores[rankIndex].score,
      classAverage,
      rank,
      totalStudents: scores.length
    }));

  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// 📊 SINIF RANKING LİSTESİ (TEK ÖDEV)
router.get("/class-ranking-list/:assignmentId/:classId", async (req, res) => {
  try {
    const { assignmentId, classId } = req.params;

    // 1️⃣ Sınıftaki öğrencileri al
    const studentClasses = await StudentClasses.find({ class: classId })
        .populate("student", "first_name last_name")
        .select("student");

    if (!studentClasses.length) {
      throw new CustomError(
          Enum.HTTP_CODES.NOT_FOUND,
          "Not Found",
          "No students in class"
      );
    }

    const studentIds = studentClasses.map(sc => sc.student._id.toString());

    // 2️⃣ Bu ödev için tüm cevapları al
    const answers = await StudentAnswers.find({
      assignment: assignmentId,
      student: { $in: studentIds }
    });

    // 3️⃣ Öğrenci bazlı skor map
    const scoreMap = {};

    studentIds.forEach(id => {
      scoreMap[id] = { correct: 0, total: 0 };
    });

    answers.forEach(answer => {
      const sid = answer.student.toString();
      scoreMap[sid].total += 1;
      if (answer.is_correct) scoreMap[sid].correct += 1;
    });

    // 4️⃣ Skorları hesapla
    const ranking = studentClasses.map(sc => {
      const sid = sc.student._id.toString();
      const data = scoreMap[sid];

      const score =
          data.total > 0
              ? Math.round((data.correct / data.total) * 100)
              : 0;

      return {
        studentId: sid,
        first_name: sc.student.first_name,
        last_name: sc.student.last_name,
        score
      };
    });

    // 5️⃣ Sıralama (yüksekten düşüğe)
    ranking.sort((a, b) => b.score - a.score);

    // 6️⃣ Rank ekle
    ranking.forEach((item, index) => {
      item.rank = index + 1;
    });

    // 7️⃣ Sınıf ortalaması
    const classAverage = Math.round(
        ranking.reduce((sum, s) => sum + s.score, 0) / ranking.length
    );

    res.json(Response.successResponse({
      classAverage,
      totalStudents: ranking.length,
      ranking
    }));

  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});



module.exports = router;
