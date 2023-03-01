const express = require ("express");
const{
    viewAllUsers,addUsers, getSingleUser,updateUsers,deleteUsers
}= require("../Controller/userController.js");

const router = express.Router();
router.route("/").get(viewAllUsers);
router.route("/").post(addUsers);
router.route("/:email").get(getSingleUser);
router.route("/:id").patch(updateUsers);
router.route("/:id").delete(deleteUsers);
module.exports = router;