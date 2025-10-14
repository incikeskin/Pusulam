const mongoose =  require("mongoose");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name:{type: String, required: true} ,
    is_active: {type: Boolean, required: true},
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    }

},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Roles extends mongoose.Model {
    static async remove(query){
        if (query._id) {
            await RolePrivileges.deleteMany({ role_id: query._id }); // eski remove yerine
        }

        await super.deleteOne(query); // super.remove yerine
    }
}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);