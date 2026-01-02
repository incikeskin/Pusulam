var express = require('express');
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError= require("../lib/Error")
const Enum = require("../config/Enum");
const AuditLogs = require('../lib/AuditLogs');
const logger = require('../lib/logger/LoggerClass');

/* GET categories listing with question count */
router.get("/", async (req, res) => {
  try {
    const categories = await Categories.aggregate([
      {
        $lookup: {
          from: "questions",        // questions collection
          localField: "_id",
          foreignField: "category",
          as: "questions"
        }
      },
      {
        $addFields: {
          questionCount: { $size: "$questions" }
        }
      },
      {
        $project: {
          questions: 0 // frontend'e gereksiz data gitmesin
        }
      }
    ]);

    res.json(Response.successResponse(categories));
  } catch (err) {
    let errorResponse = Response.errorReponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post('/add', async(req, res)=>{
  let body= req.body;
  try{
    if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error", "name fields must be filled");
    let category= new Categories({
      name: body.name,
      is_active: true,
      created_by: req.user?.id
    });
    await category.save();

    AuditLogs.info(req.user?.email, "Categories", "Add", category );
    logger.info(req.user?.email, "Categories", "Add", category);

    res.json(Response.successResponse({success: true}));
  } catch(err) {
    logger.error(req.user?.email, "Categories", "Add", err);
    let errorReponse = Response.errorReponse(err);
    res.status(errorReponse.code).json(errorReponse);
  }
});

router.post("/update", async(req,res)=> {
  let body = req.body;
  try{
    if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error", "_id fields must be filled");
    
    let updates= {};

    if(body.name) updates.name= body.name;
    if (typeof body.is_active === "boolean") updates.is_active= body.is_active;

    await Categories.updateOne({_id: body._id},updates);

    AuditLogs.info(req.user?.email, "Categories", "Update", {_id: body._id, ...updates} );

    res.json(Response.successResponse({success: true}));

  } catch(err) {
    let errorReponse = Response.errorReponse(err);
    res.status(errorReponse.code).json(errorReponse);
  }
});

router.post("/delete", async(req, res)=> {
  let body= req.body;
  const { _id } = req.body;
  try {
    if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error", "_id fields must be filled");

    await Categories.findByIdAndDelete(_id);

    AuditLogs.info(req.user?.email, "Categories", "Delete", {_id: body._id} );

    res.json(Response.successResponse({success: true}));
    
  }catch(err) {
    let errorReponse = Response.errorReponse(err);
    res.status(errorReponse.code).json(errorReponse);
  }
})

module.exports = router;
