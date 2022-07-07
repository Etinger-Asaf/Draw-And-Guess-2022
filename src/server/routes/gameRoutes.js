const express = require("express");

const userController = require("../controllers/userController");
const gameController = require("../controllers/gameController");
const anotherGameController = require("../controllers/anotherGameController");

const router = express.Router();

router.route("/").post(userController.setANewUser);
router.route("/").delete(userController.deleteUser);
router.route("/").get(userController.activeUsers);
router.route("/allUsers").get(userController.allUsers);

router.route("/gameData").post(gameController.setWordAndDraw);
router.route("/gameData").get(gameController.getCurrentDrawAndWord);
router.route("/gameData").delete(gameController.deleteGame);

router.route("/anotherGame").get(anotherGameController.getAnotherGameValue);
router.route("/anotherGame").post(anotherGameController.setAnotherGameValue);

module.exports = router;
