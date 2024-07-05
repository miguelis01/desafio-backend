const router = require("express").Router();

const UserController = require("../controllers/UserController");

// middleware
const verifyToken = require("../helpers/verify-token");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/:id", UserController.getUserById);
router.get("/checkuser", UserController.checkUser);

module.exports = router;
