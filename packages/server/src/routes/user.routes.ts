import express from "express";
import { UserRoutes } from "@chess-game/shared/src/api/routes";
import { GetUserController } from "~Controllers/user.controllers";
import { authenticateJWT } from "~Middleware/authJWT.middleware";

const router = express.Router();

router.get(UserRoutes.GetUser(), authenticateJWT, GetUserController);

export default router;