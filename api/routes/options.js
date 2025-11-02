var express = require("express");
var router = express.Router();
const Options = require("../db/models/Options");
const Questions = require("../db/models/Questions");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// 🔹 Tüm endpointlerde kimlik doğrulama
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

// ✅ 1. Tüm seçenekleri listele
router.get("/", async (req, res) => {
  try {
    const records = await Options.find({})
      .populate("question", "text");

    res.json(Response.successResponse(records));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 2. Yeni bir şık ekle
router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.question)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "question field must be filled");
    if (!body.text)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "text field must be filled");

    const newOption = await Options.create({
      question: body.question,
      text: body.text,
      image: body.image || null,
      is_correct: body.is_correct || false
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newOption, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 3. Şık güncelle
router.post("/update", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    const updated = await Options.findByIdAndUpdate(
      body._id,
      {
        question: body.question,
        text: body.text,
        image: body.image,
        is_correct: body.is_correct
      },
      { new: true }
    );

    if (!updated)
      throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Not Found", "Option not found");

    res.json(Response.successResponse(updated));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 4. Şık sil
router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

    await Options.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

// ✅ 5. Belirli bir soruya ait şıkları listele
router.get("/list-by-question/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const records = await Options.find({ question: questionId });

    res.json(Response.successResponse(records));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
