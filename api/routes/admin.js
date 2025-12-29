var express = require("express");
var router = express.Router();

const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

// MODELLER
const Users = require("../db/models/Users");
const Roles = require("../db/models/Roles");
const UserRoles = require("../db/models/UserRoles");
const Classes = require("../db/models/Classes");
const Assignments = require("../db/models/Assignments");
const Questions = require("../db/models/Questions");

// 🔐 AUTH + SADECE ADMIN
router.all("*", auth.authenticate(), (req, res, next) => {
    next();
});

/**
 * GET /api/admin/dashboard-stats
 */
router.get("/dashboard-stats", async (req, res) => {
    try {
        // 🔹 1. Toplam sayılar
        const classCount = await Classes.countDocuments();
        const assignmentCount = await Assignments.countDocuments();
        const questionCount = await Questions.countDocuments();

        // 🔹 2. Rol ID’lerini bul
        const roles = await Roles.find(
            { role_name: { $in: ["student", "teacher", "Admin"] } },
            { _id: 1, role_name: 1 }
        );

        const roleMap = {};
        roles.forEach((r) => {
            roleMap[r.role_name] = r._id;
        });

        // 🔹 3. UserRoles üzerinden sayımlar
        const studentCount = await UserRoles.countDocuments({
            role_id: roleMap["student"],
        });

        const teacherCount = await UserRoles.countDocuments({
            role_id: roleMap["teacher"],
        });

        const adminCount = await UserRoles.countDocuments({
            role_id: roleMap["Admin"],
        });

        res.json(
            Response.successResponse({
                classCount,
                assignmentCount,
                questionCount,
                studentCount,
                teacherCount,
                adminCount,
            })
        );
    } catch (err) {
        const errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

/**
 * GET /api/admin/users?role=student|teacher|Admin
 */
router.get("/users", async (req, res) => {
    try {
        const { role } = req.query;

        if (!role)
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "role query param is required"
            );

        // 1️⃣ Rolü bul
        const roleDoc = await Roles.findOne({ role_name: role });

        if (!roleDoc)
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found",
                "Role not found"
            );

        // 2️⃣ Bu role sahip kullanıcı id’leri
        const userRoles = await UserRoles.find({ role_id: roleDoc._id });

        const userIds = userRoles.map((ur) => ur.user_id);

        // 3️⃣ Users tablosundan kullanıcılar
        const users = await Users.find(
            { _id: { $in: userIds } },
            {
                password: 0, // 🔐 asla dönme
            }
        );

        res.json(Response.successResponse(users));
    } catch (err) {
        const errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;
