const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  });

export default asyncHandler;
