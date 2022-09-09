/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
