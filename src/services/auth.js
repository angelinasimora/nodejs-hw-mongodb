import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from 'crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/auth.js";

import SessionsCollection from "../db/contacts/session.js";
import { UsersCollection } from "../db/contacts/Contact.js";


const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = Date.now() + FIFTEEN_MINUTES;
  const refreshTokenValidUntil = Date.now() + ONE_DAY;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = query => SessionsCollection.findOne(query);

export const findUser = query => UsersCollection.findOne(query);

export const registerUser = async payload => {
    const {email, password} = payload;
    const user = await findUser({email});

    if(user) {
        throw createHttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return await UsersCollection.create({...payload, password: hashPassword});
};


export const loginUser = async payload => {
    const {email, password} = payload;
    const user = await findUser({email});
    if(!user) {
        throw createHttpError(401, "User not found");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw createHttpError(401, "Email or password invalid");
    }

    await SessionsCollection.findOneAndDelete({userId: user._id});

    const session = createSession();

    return SessionsCollection.create({
        userId: user._id,
        ...session,
    });
};

export const logoutUser = sessionId => SessionsCollection.deleteOne({_id: sessionId});


export const refreshUser = async ({refreshToken, sessionId})=> {
    const session = await findSession({refreshToken, _id: sessionId});
    if(!session) {
        throw createHttpError(401, "Session not found");
    }

    if(session.refreshTokenValidUntil < Date.now()) {
        await SessionsCollection.findOneAndDelete({_id: session._id});
        throw createHttpError(401, "Session token expired");
    }

    await SessionsCollection.findOneAndDelete({_id: session._id});

    const newSession = createSession();

    return SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};
