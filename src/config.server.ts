export default {
  port: process.env.PORT,
  rateLimitAmount: process.env.RATE_LIMIT_AMOUNT,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW,
  origin: process.env.ALLOWED_ORIGIN,
};
