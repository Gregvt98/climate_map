/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoiZ3JlZ3Z0aCIsImEiOiJjbDFpNTlhaG4wa201M2NuMmJya21lb29nIn0.1hyD7k2t2x_r_FYDuifH8Q',
    GOOGLE_CLIENT_ID: '122722833303-ggnes9np21bkt41qco2k1hifmtfme8p8.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: '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',
    NEXTAUTH_URL: 'http://localhost:3000/', 
    JWT_SECRET: 'SsbUu6QUSkjd+3Zw56UnvLPWQaW58Oplhx4yAXs7jDc='
  }
}

module.exports = nextConfig
