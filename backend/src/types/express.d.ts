declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string; tier: string };
      rawBody?: Buffer;
    }
  }
}

export {};

