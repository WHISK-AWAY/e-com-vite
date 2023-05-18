import express, { Response, Request, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const SECRET = process.env.SECRET;
import { User } from '../database/index';
import { z, ZodError } from 'zod';

const zUUID = z.string().uuid();

interface IToken {
  id: string;
  role: string;
}

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('Not logged in (checkauthenticated middleware)');
}

export function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    return next();
  }
  console.log(
    'Cannot be here while logged in (checkNotAuthenticated middleware)'
  );
  return res.redirect('/');
}

// export function checkAuthenticated(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     req.isAuthenticated = false;

//     const token = req.headers.authorization;

//     if (!token) return res.status(401).send('Need token to proceed');
//     const verifiedToken = jwt.verify(token, SECRET!) as IToken;
//     req.isAuthenticated = true;
//     req.userId = verifiedToken.id;
//     // console.log('VT', verifiedToken);

//     next();
//   } catch (err) {
//     if (err instanceof JsonWebTokenError)
//       res.status(403).send('Get the fuck out');
//     next(err);
//   }
// }

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send('Invalid token');
    const verifiedToken = jwt.verify(token, SECRET!) as IToken;

    if (verifiedToken.role !== 'admin')
      return res
        .status(403)
        .send('Permission denied: have to be an admin to access this route');

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) res.status(403).send('Get out');
    next(err);
  }
}

export async function sameUserOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;
    const { userId } = req.params;

    const parsedUUID = zUUID.parse(userId);
    if (!parsedUUID) return res.status(500).send('Invalid user ID');

    if (!token) return res.status(403).send('Invalid token');

    const verifiedToken = jwt.verify(token, SECRET!) as IToken;
    if (verifiedToken.id !== parsedUUID && verifiedToken.role !== 'admin')
      return res
        .status(403)
        .send('Authorization failed: must be an admin or logged in user');

    next();
  } catch (err) {
    if (err instanceof ZodError)
      return res
        .status(400)
        .send('Provided UUID does not match the database records');
    if (err instanceof JsonWebTokenError)
      return res.status(403).send('You donnot belong here');
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
