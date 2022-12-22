/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  images: {
    domains: ["d2xi011jjczziv.cloudfront.net"]
  },
  experimental: {
    scrollRestoration: true
  },
  headers: {
    'Cache-Control': 'public, max-age=1296000'
  }
}

module.exports = nextConfig
