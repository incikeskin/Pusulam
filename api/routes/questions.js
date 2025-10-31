var express = require("express");
var router = express.Router();
const Questions = require("../db/models/Questions");
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// 🔹 Tüm endpointlerde kimlik doğrulama
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

// ✅ 1. Tüm soruları listele
router.get("/", async (req, res) => {
  try {
    const questions = await Questions.find({})
      .populate("category", "name");
    res.json(Response.successResponse(questions));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 2. Soru ekle
router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.text)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "text field must be filled");

    const newQuestion = await Questions.create({
      text: body.text,
      category: body.category,
      difficulty: body.difficulty || "medium",
      image: body.image,
      is_active: body.is_active !== undefined ? body.is_active : true
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newQuestion, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 3. Soru güncelle
router.post("/update", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    const updates = {};
    if (body.text) updates.text = body.text;
    if (body.category) updates.category = body.category;
    if (body.difficulty) updates.difficulty = body.difficulty;
    if (body.image !== undefined) updates.image = body.image;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    await Questions.updateOne({ _id: body._id }, updates);

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 4. Soru sil
router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await Questions.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 5. Kategoriye göre soruları listele
router.get("/list-by-category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const questions = await Questions.find({ category: categoryId })
      .populate("category", "name");

    res.json(Response.successResponse(questions));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
