// async 라우트에서 던져진 에러가 조용히 사라지지 않도록 next()로 넘긴다.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
