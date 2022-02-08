import { Response } from "express";

export const errorHandler = (err: any, res: Response) => {
  if (typeof (err) === 'string') {
      // custom application error
      return res.status(400).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}