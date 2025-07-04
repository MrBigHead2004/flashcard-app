const mongoose = require("mongoose");
const FolderFlashcard = require("../../models/folderFlashcard.model");
const Flashcard = require("../../models/flashcard.model");
const getCambridgeWordScramble = require("../../helpers/cambridgeWordScamble.helper");
const GameSession = require("../../models/gameSession.model");
const UserInformation = require("../../models/userInformation.model");

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// [GET] /api/v1/game/word-scramble?count=x
module.exports.getWordScramble = async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 10;
        const flashcards = await Flashcard.aggregate([
            { $sample: { size: count } },
        ]);

        const result = flashcards.map((card) => {
            const allDefinitions = card.meanings
                .flatMap((m) => m.definitions || [])
                .filter((def) => def.definition);

            const randomDef =
                allDefinitions.length > 0
                    ? allDefinitions[
                          Math.floor(Math.random() * allDefinitions.length)
                      ]
                    : null;

            return {
                word: card.word,
                definition: randomDef
                    ? randomDef.definition
                    : "Without definition",
            };
        });

        res.json({
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.error(
            `[GET /api/v1/game/word-scramble?count=${count}]`,
            err.message
        );
        res.status(500).json({
            message: "Có lỗi xảy ra, vui lòng thử lại sau",
        });
    }
};

// [POST] /api/v1/game/word-scramble
module.exports.createWordScrambleSession = async (req, res) => {
    const userId = req.userId;
    const { score, duration, scrambledWords, correctWords, playAt } = req.body;
    try {
        const gameSession = await GameSession.create({
            userId: userId,
            score: score,
            duration: duration,
            scrambledWords: scrambledWords || [],
            correctWords: correctWords || [],
            playAt: playAt ? new Date(playAt) : new Date(),
        });
        const userInformation = await UserInformation.findOne({
            userId: userId,
        });
        if (!userInformation) {
            return res.status(404).json({
                message: "User information not found",
            });
        }
        userInformation.totalScore += score;
        userInformation.save();
        res.status(201).json({
            message: "Game session created successfully",
            data: gameSession,
        });
    } catch (error) {
        console.error("[POST /api/v1/game/word-scramble]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// [GET] /api/v1/game/word-scramble/history?page=x&limit=y&sortBy=playAt&sortOrder=desc
module.exports.getWordScrambleHistory = async (req, res) => {
    const userId = req.userId;
    try {
        const page =
            parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const limit =
            parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
        const skip = (page - 1) * limit;
        const { sortBy = "playAt", sortOrder = "desc" } = req.query;
        const sortFields = ["playAt", "score", "duration"];
        const sortFilter = sortFields.includes(sortBy) ? sortBy : "playAt";
        const sortOrderFilter = sortOrder === "asc" ? 1 : -1;
        const gameSessions = await GameSession.find({ userId: userId })
            .select("-__v -userId")
            .sort({ [sortFilter]: sortOrderFilter })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Game session history retrieved successfully",
            data: gameSessions,
        });
    } catch (error) {
        console.error("[GET /api/v1/game/word-scramble/history]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// [GET] /api/v1/game/word-scramble/history/:id
module.exports.getWordScrambeSessionDetail = async (req, res) => {
    const userId = req.userId;
    const sessionId = req.params.id;

    try {
        const gameSession = await GameSession.findOne({
            _id: sessionId,
            userId: userId,
        }).select("-__v -userId");

        if (!gameSession) {
            return res.status(404).json({
                message: "Game session not found",
            });
        }
        res.status(200).json({
            message: "Game session detail retrieved successfully",
            data: gameSession,
        });
    } catch (error) {
        console.error(
            `[GET /api/v1/game/word-scramble/history/${sessionId}]`,
            error
        );
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// [GET] /api/v1/game/multichoice
module.exports.getMultiChoice = async (req, res) => {
    try {
        const count = 10;
        const totalFlashcards = count * 4;

        const flashcards = await Flashcard.aggregate([
            { $match: { "meanings.definitions.definition": { $exists: true } } },
            { $sample: { size: totalFlashcards } },
        ]);

        if (flashcards.length < totalFlashcards) {
            return res.status(400).json({ message: "Not enough flashcards to generate quiz." });
        }

        const questions = [];

        for (let i = 0; i < count; i++) {
            const group = flashcards.slice(i * 4, (i + 1) * 4);

            const correctCard = group[0];
            const incorrectCards = group.slice(1);

            const definitions = correctCard.meanings
                .flatMap((m) => m.definitions || [])
                .filter((d) => d.definition);

            if (!definitions.length) continue; 

            const chosenDef = definitions[Math.floor(Math.random() * definitions.length)].definition;
            const correctWord = correctCard.word;
            const wrongWords = incorrectCards.map((c) => c.word);

            const answerList = shuffleArray([correctWord, ...wrongWords]);

            questions.push({
                question: chosenDef,
                answer: correctWord,
                answerList,
            });
        }
        res.status(200).json({
            message: "Quiz generated successfully",
            data: questions,
        });
    } catch (error) {
        console.error("[GET /api/v1/game/multichoice]", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
