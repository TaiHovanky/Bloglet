export const errorHandler = (err: any) => {
  if (typeof (err) === 'string') {
      console.info(err, new Date().toLocaleString());
      return;
  }

  console.info(err);
  return;
}