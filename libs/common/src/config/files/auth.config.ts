export default () => ({
  access_token: process.env.JWT_SECRET,
  refresh_token: process.env.JWT_REFRESH_SECRET,
});
