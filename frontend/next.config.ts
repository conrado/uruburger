import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.example.com', // Example domain from your default data
      'i.imgur.com', // Imgur domain for image uploads
      'imgur.com', // Imgur base domain
      'via.placeholder.com', // Placeholder image domain
      'placekitten.com', // Alternative placeholder image domain (optional)
      'localhost', // Local development images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // As a fallback, allow any https hostname
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
