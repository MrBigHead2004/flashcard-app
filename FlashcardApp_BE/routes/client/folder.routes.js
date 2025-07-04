const express = require("express");
//Controllers
const controller = require("../../controllers/client/folder.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const router = express.Router();
//Schemas
const {folderSchema, folderAddFlashcardSchema, folderAddMultiFlashcardSchema} = require("../../schemas/client/folder.schema");

router.get("/", authMiddleWare.checkAccessToken(), controller.getAllFolders);

router.post("/",validateMiddleWare.validateInput(folderSchema), authMiddleWare.checkAccessToken(), controller.createFolder);

router.get("/flashcards/:fc_slug/favourite", authMiddleWare.checkAccessToken(), controller.checkFlashcardInFavourite);

router.get("/check/flashcards/:fc_slug", authMiddleWare.checkAccessToken(), controller.checkFlashcardInFolder);

router.post("/share/flashcards", authMiddleWare.checkAccessToken(), validateMiddleWare.validateInput(folderAddMultiFlashcardSchema), controller.addMultiFlashcardToFolder);

router.get("/:slug", authMiddleWare.checkAccessToken(), controller.getFolderBySlug);

router.patch("/:slug", authMiddleWare.checkAccessToken(), validateMiddleWare.validateInput(folderSchema), controller.updateFolder);

router.delete("/:slug", authMiddleWare.checkAccessToken(), controller.deleteFolder);

router.get("/:slug/flashcards", authMiddleWare.checkAccessToken(), controller.getFolderFlashcards);

router.post("/flashcards", validateMiddleWare.validateInput(folderAddFlashcardSchema), authMiddleWare.checkAccessToken(), controller.addFlashcard);

router.get("/:slug/flashcards/:fc_slug", authMiddleWare.checkAccessToken(), controller.getFlashcardInFolder);

router.delete("/:slug/flashcards/:fc_slug", authMiddleWare.checkAccessToken(), controller.deleteFlashcardInFolder);


module.exports = router;