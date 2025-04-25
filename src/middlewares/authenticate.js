import createHttpError from "http-errors";

// import { findSession, findUser } from "../services/auth.js";

import SessionsCollection from "../db/contacts/session.js";


export const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const session = await SessionsCollection.findOne({
    accessToken: token,
  }).populate('userId');

  if (!session) {
    return next(createHttpError(401, 'Invalid access token'));
  }

  const isExpired =
    Date.now() > new Date(session.accessTokenValidUntil).getTime();

  if (isExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  req.user = session.userId;

  next();
};
