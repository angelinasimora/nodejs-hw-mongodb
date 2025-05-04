import  SessionCollection  from '../db/contacts/session.js';

export const deleteSession = async (sessionId) => {
  const session = await SessionCollection.findByIdAndDelete(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  return session;
};


export const deleteUserSessions = async (userId) => {
  await SessionCollection.deleteMany({ userId });
};
