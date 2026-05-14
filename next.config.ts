import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
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
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://*.cloudflare.com https://*.cloudflareinsights.com`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://*.booking.com https://*.stripe.com https://*.cloudflare.com",
              "font-src 'self' data:",
              "frame-src https://www.google.com https://maps.google.com https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com https://*.cloudflare.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firestore.googleapis.com https://*.firebaseio.com https://api.stripe.com https://www.paypal.com https://*.cloudflare.com https://*.cloudflareinsights.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
