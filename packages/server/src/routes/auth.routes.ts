import { LoginUserController, RegisterUserController } from "~Controllers/auth.controllers";
import express from "express";
import { Routes } from "@chess-game/shared/src/api/routes";

const router = express.Router();

router.post(Routes.RegisterUser(), RegisterUserController);
router.post(Routes.LoginUser(), LoginUserController);

export default router;