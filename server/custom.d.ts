declare namespace Express {
  export interface Request {
    isAuthenticated?: boolean;
    userId?: string;
  }

  export interface User {
    _id: string;
  }
}
