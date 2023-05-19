import { Response, Request, NextFunction } from 'express';
import { z } from 'zod';

const zUUID = z.string().uuid({ message: 'Invalid userId format' });

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
