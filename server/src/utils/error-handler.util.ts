// import { Response } from "express";

export const errorHandler = (err: any) => {
  if (typeof (err) === 'string') {
      // custom application error
      // return res.status(400).json({ message: err });
      console.info(err);
      return;
  }

  // default to 500 server error
  // return res.status(500).json({ message: err.message });
  console.info(err);
  return;
}