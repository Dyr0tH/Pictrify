/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // These options have been moved out of experimental to root level
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig 