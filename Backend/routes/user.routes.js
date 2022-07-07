const express = require("express") ;
const router = express.Router();
const {
  createUser,
  login,
  getAccessToken,
  resetPassword,
  registerUser,
  getAllUsersInfo,
  getUserInfo,
  logout,
  deleteUser,
  updateUser,
} = require("../controller/userCtrl.js") ;
const auth = require("../middleware/auth.js") ;
const authAdmin = require("../middleware/authAdmin.js") ;


router.post("/createUser", createUser);
router.post("/login", login);
router.post("/refresh_token", getAccessToken);
router.post("/reset", auth, resetPassword);
router.post("/register",auth, registerUser);
router.put("/register",auth, updateUser);
router.get("/allUsers", auth,authAdmin, getAllUsersInfo);
router.delete("/:id", auth,authAdmin, deleteUser);
router.put("/:id", auth,authAdmin, updateUser);
router.get("/userInfo", auth, getUserInfo);
router.get("/logout", auth, logout);

module.exports = router