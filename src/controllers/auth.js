import { registerUser,loginUser,logoutUser,refreshUser } from "../services/auth.js";

import { ONE_DAY } from "../constants/auth.js";

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};
export const registerUserController = async(req, res)=> {
    await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully register user",
    });
};

export const loginUserController = async(req, res)=> {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Login successfully",
        data: {
            accessToken: session.accessToken,
        }
    });
};


export const logoutUserController = async (req, res) => {
    if(req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};



export const refreshUserController = async (req, res) => {
  const session = await refreshUser(req.cookies);

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Session successfully refresh",
        data: {
            accessToken: session.accessToken,
        }
    });
};
