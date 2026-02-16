/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out the export configuration
  // output: 'export',
  // trailingSlash: true,
  
  // Keep image optimization - this will now work with ISR
  images: {
    unoptimized: false, // Set to false to allow Next.js to optimize images
    domains: ['www.freecompoundcalculator.com'], // Add your image domains here
  },
  
  // Headers configuration for security and IndexNow
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Ensure the IndexNow key file has correct content-type
      {
        source: '/:key.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      // Cache control for sitemap
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=1800',
          },
        ],
      },
      // Cache control for robots.txt
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
  
  // Configure redirects if needed
  async redirects() {
    return [
      // Add any redirects here
      // Example: {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // Configure rewrites for API or special routes
  async rewrites() {
    return [
      // Optional: Proxy for IndexNow if needed
      // {
      //   source: '/indexnow',
      //   destination: '/api/bing-indexnow',
      // },
    ];
  },

  // Build configuration
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  generateEtags: true, // Generate ETags for better caching
  
  // Experimental features (optional)
  experimental: {
    // optimizeCss: false, // Enable if you have CSS optimization needs
    // scrollRestoration: true,
  },
}

module.exports = nextConfig