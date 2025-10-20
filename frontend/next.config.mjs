/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // ✅ add your Cloudinary domain
    // optional: remotePatterns if you have more complex URL patterns
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/dptpomjco/**',
    //   },
    // ],
    // unoptimized: false, // remove this in production
  },
};

export default nextConfig;
