/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push('pg', 'sqlite3', 'tedious', 'pg-hstore');
    return config;
  },
}

export default nextConfig
