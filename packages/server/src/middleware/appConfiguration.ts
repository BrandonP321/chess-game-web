/**
 * Generic middleware that would normally be defined in server.ts
 */
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

export const configureApp = (app: Express) => {
    app.use(helmet());

    app.use(cors({
        origin: "http://localhost:3000",
        // origin: "http://10.0.0.170:3000/",
        credentials: true,
        // exposedHeaders: "auth-token"
    }));

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', "true")
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
        next()
    })


    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());

    app.use(expressMongoSanitize());
}