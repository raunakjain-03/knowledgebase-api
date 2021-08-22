// @desc        Handles Async calls across API to minimize risk of avoiding try catch
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
