import createHttpError from "http-errors";
import { findSession, findUser } from "../services/auth.js";


export const authenticate = async (req, res, next) => {
    const authorization = req.get("Authorization");
    if (!authorization) {
        next(createHttpError(401, 'Please provide Authorization header'));
        return;
    }

    const [bearer, accessToken] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        next(createHttpError(401, 'Auth header should be of type Bearer'));
        return;
    }

    const session = await findSession({ accessToken });

    if (!session) {
        next(createHttpError(401, 'Session not found'));
        return;
    }

    const isAccessTokenExpired =
        new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
        next(createHttpError(401, 'Access token expired'));
        return;
    }

    const user = await findUser(session.userId);

    if (!user) {
        next(createHttpError(401));
        return;
    }

    req.user = user;
    next();
};
