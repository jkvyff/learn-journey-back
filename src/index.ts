import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./auth";
import { User } from "./entity/User";
import { sendRefreshToken } from "./sendRefreshToken";


(async() => {
    const app = express()
    app.use(cookieParser());
    app.get('/', (_req, res) => res.send('hello'));
    
    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid
        console.log(req.cookies)
        if (!token) {
            return res.send({ ok: false, accessToken: '' })
        }
        
        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
        } catch(err) {
            console.log(err);
            return res.send({ ok: false, accessToken: '' })
        }

        const user = await User.findOne({ id: payload.userId })

        if (!user) {
            return res.send({ ok: false, accessToken: '' })
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAccessToken(user) })
    })

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    })

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("express server started")
    })
})()
