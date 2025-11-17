var express = require("express");
var router = express.Router();
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
    const classes = await Classes.find({})
      .populate("teacher", "first_name last_name email"); // öğretmen bilgilerini getir
    res.json(Response.successResponse(classes));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/add", async (req, res) => {
  try {
    const body = req.body;

    if (!body.name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "name field must be filled"
      );

    const newClass = await Classes.create({
      name: body.name,
      teacher: req.user?.id, // Auth’tan gelen öğretmen (JWT’deki id)
      is_active: true,
    });

    res
      .status(Enum.HTTP_CODES.CREATED)
      .json(Response.successResponse(newClass, Enum.HTTP_CODES.CREATED));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/update", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "_id field must be filled"
      );

    const updates = {};
    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    await Classes.updateOne({ _id: body._id }, updates);

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/delete", async (req, res) => {
  try {
    const body = req.body;

    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "_id field must be filled"
      );

    await Classes.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
