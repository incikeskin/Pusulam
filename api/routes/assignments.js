var express = require("express");
var router = express.Router();
const Assignments = require("../db/models/Assignments");
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

// ✅ 1. Tüm ödevleri listele
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

// ✅ 2. Ödev ekle
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

// ✅ 3. Ödev güncelle
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

// ✅ 4. Ödev sil
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

// ✅ 5. Sınıfa göre ödevleri listele
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

module.exports = router;
