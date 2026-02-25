export default () => ({
  driver: 'minio',
  url: process.env.MINIO_URL,
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  ssl: process.env.MINIO_SSL === 'true',
  access_key: process.env.MINIO_ACCESS_KEY,
  secret_key: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET,
  public: process.env.MINIO_PUBLIC,
});
