var express = require("express");
var router = express.Router();
const Assignments = require("../db/models/Assignments");
const AssignmentQuestions = require("../db/models/AssignmentQuestions");
const Options = require("../db/models/Options");
const Questions = require("../db/models/Questions");
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

// Tüm ödevleri listele
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignments.find({})
      .populate("teacher", "first_name last_name email")
      .populate("class", "name");
    res.json(Response.successResponse(assignments));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Ödev ekle
router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.title)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "title field must be filled");
    if (!body.class)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "class field must be filled");
    if (!body.teacher)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "teacher field must be filled");

    const newAssignment = await Assignments.create({
      title: body.title,
      description: body.description,
      class: body.class,
      teacher: body.teacher,
      due_date: body.due_date,
      is_active: body.is_active !== undefined ? body.is_active : true
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newAssignment, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Ödev güncelle
router.post("/update", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    const updates = {};
    if (body.title) updates.title = body.title;
    if (body.description) updates.description = body.description;
    if (body.class) updates.class = body.class;
    if (body.teacher) updates.teacher = body.teacher;
    if (body.due_date) updates.due_date = body.due_date;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    await Assignments.updateOne({ _id: body._id }, updates);

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Ödev sil
router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await Assignments.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Sınıfa göre ödevleri listele
router.get("/list-by-class/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;

    const assignments = await Assignments.find({ class: classId })
      .populate("teacher", "first_name last_name email")
      .populate("class", "name");

    res.json(Response.successResponse(assignments));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// Ödevin içindeki tüm soruları ve şıkları getir
router.get("/:assignmentId/full", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    // Ödev bilgilerini bul
    const assignment = await Assignments.findById(assignmentId)
      .select("title description due_date class teacher")
      .populate("class", "name")
      .populate("teacher", "first_name last_name");

    if (!assignment)
      throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Not Found", "Assignment not found");

    // Ödeve ait soruları getir
    const assignmentQuestions = await AssignmentQuestions.find({ assignment: assignmentId })
      .populate("question");

    //Her sorunun şıklarını getir
    const questionsWithOptions = await Promise.all(
      assignmentQuestions.map(async (aq) => {
        const options = await Options.find({ question: aq.question._id }).select("text is_correct image");
        return {
          _id: aq.question._id,
          text: aq.question.text,
          image: aq.question.image,
          difficulty: aq.question.difficulty,
          options
        };
      })
    );

    // Sonuç döndür
    res.json(
      Response.successResponse({
        assignment,
        questions: questionsWithOptions
      })
    );
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
