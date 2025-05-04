import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from 'crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/auth.js";

import SessionCollection from "../db/contacts/session.js";
import  UsersCollection  from "../db/contacts/user.js";

import { getEnvVar } from "../utils/getEnvVar.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "./emailService.js";


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

export const findSession = query => SessionCollection.findOne(query);

export const findUser = query => UsersCollection.findOne(query);

const appDomain = getEnvVar('APP_DOMAIN');

export const registerUser = async payload => {
    const {email, password} = payload;
    const user = await findUser({email});

    if(user) {
        throw createHttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });
     return newUser;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  try {
    await sendEmail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${appDomain}/auth/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error.message);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.findOneAndDelete({ userId: user._id });
};


export const loginUser = async payload => {
    const {email, password} = payload;
    const user = await findUser({email});
    if(!user) {
        throw createHttpError(401, "User not found");
    }

    // if(!user.verify) {
    //     throw createHttpError(401, "User not verified");
    // }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw createHttpError(401, "Email or password invalid");
    }

    await SessionCollection.findOneAndDelete({userId: user._id});

    const session = createSession();

    return SessionCollection.create({
        userId: user._id,
        ...session,
    });
};

export const refreshUser = async ({refreshToken, sessionId})=> {
    const session = await findSession({refreshToken, _id: sessionId});
    if(!session) {
        throw createHttpError(401, "Session not found");
    }

    if(session.refreshTokenValidUntil < Date.now()) {
        await SessionCollection.findOneAndDelete({_id: session._id});
        throw createHttpError(401, "Session token expired");
    }

    await SessionCollection.findOneAndDelete({_id: session._id});

    const newSession = createSession();

    return SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
  };

  export const logoutUser = sessionId => SessionCollection.deleteOne({_id: sessionId});
