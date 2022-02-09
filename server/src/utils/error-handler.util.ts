export const errorHandler = (err: any) => {
  if (typeof (err) === 'string') {
      console.info(err);
      return;
  }

  console.info(err);
  return;
}