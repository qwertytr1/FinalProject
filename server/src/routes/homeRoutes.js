const express = require("express");
const router = express.Router();
const homeController = require("../controllers/mainPageController.js"); // Контроллер с логикой

router.get("/latest-templates", homeController.getLatestTemplates);
router.get("/top-templates", homeController.getTopTemplates);
router.get("/tags-cloud", homeController.getTagsCloud);

module.exports = router;
