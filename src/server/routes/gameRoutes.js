const express = require("express");

const userController = require("../controllers/userController");
const gameController = require("../controllers/gameController");

const router = express.Router();

router.route("/").post(userController.setANewUser);
router.route("/").delete(userController.deleteUser);
router.route("/").get(userController.activeUsers);
router.route("/allUsers").get(userController.allUsers);

router.route("/gameData").post(gameController.setWordAndDraw);
router.route("/gameData").get(gameController.getCurrentDrawAndWord);
router.route("/gameData").delete(gameController.deleteGame);


module.exports = router;
