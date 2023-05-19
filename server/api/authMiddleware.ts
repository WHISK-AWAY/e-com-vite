import express, { Response, Request, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const SECRET = process.env.SECRET;
import { User } from '../database/index';
import { z, ZodError } from 'zod';

const zUUID = z.string().uuid({ message: 'Invalid userId format' });

interface IToken {
  id: string;
  role: string;
}

/**
 * * Check for logged-in user
 * (updated for passport)
 */

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.isAuthenticated()) {
      req.userId = req.user!._id;
      return next();
    }
    return res
      .status(401)
      .json({ message: 'Must be logged in to access this route' });
  } catch (err) {
    next(err);
  }
}

/**
 * * Check for admin privileges
 */

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user || req.user.role !== 'admin')
      return res.status(403).send('Permission denied: insufficient privileges');

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * * Check for "same user or admin"
 * User must match ID used in URL string, or else have admin rights
 * Only applies when ":userId" appears in route!
 */

export async function sameUserOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = zUUID.parse(req.params.userId);

    if (!req.user)
      return res.status(401).json({ message: 'Must be logged in to access' });

    if (req.user._id !== userId && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Logged-in user does not match requested resource' });
    }

    next();
  } catch (err) {
    next(err);
  }
}

// import dotenv from 'dotenv';
// dotenv.config();
// import { auth } from 'express-openid-connect';

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   authorizationParams: {
//     scope: 'openid read:users',
//     audience: 'e-comPB',
//   },
//   secret: '289fahnrga-yas83nfa3ca-',
//   baseURL: 'http://localhost:3001',
//   clientID: '6QeCYaBvy5ZgeovBHHqZYV7WTkix7W2z',
//   issuerBaseURL: 'https://dev-z5aj5eewyq3duaqc.us.auth0.com',
// };

// export const auth0config = auth(config);

// import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

// export const jwtCheck = auth({
//   audience: 'e-comPB',
//   issuerBaseURL: 'https://dev-z5aj5eewyq3duaqc.us.auth0.com/',
//   tokenSigningAlg: 'RS256',
//   secret: '2eah80sd0eansda03enf',
// });

// export const requiresAdmin = requiredScopes('read:users');

// export const jwtCheck = auth({
//   audience: 'e-com',
//   issuerBaseURL: 'https://dev-3nurd80vhso7rxtr.us.auth0.com/',
//   tokenSigningAlg: 'RS256',
// });
