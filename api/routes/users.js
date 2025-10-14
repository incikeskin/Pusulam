var express = require('express');
var router = express.Router();
const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    let users = await Users.find({});
    res.json(Response.successResponse(users));
  } catch (err) {
    let errorReponse = Response.errorReponse(err);
    res.status(errorReponse.code).json(errorReponse);
  }
});

router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "email field must be filled");

    

    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "password field must be filled");

    if(body.password.length < Enum.PASS_LENGTH){
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","password length must be greater than", Enum.PASS_LENGTH);
    }

    let password=  bcrypt.hashSync(body.password, bcrypt.genSaltSync(0), null);
    await Users.create({
      email: body.email,
      password,
      is_active: true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));

  } catch (err) {
    let errorReponse = Response.errorReponse(err);
    res.status(errorReponse.code).json(errorReponse);
  }
})

module.exports = router;
