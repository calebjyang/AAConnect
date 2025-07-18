/**
 * Next.js configuration for AAConnect
 * Only block Firebase Web SDK for native builds to prevent CORS issues in Capacitor apps.
 */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Disable image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // add any other domains you need here
    ],
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Only block Firebase Web SDK for client builds when building for native platforms
    // This allows web builds to work properly while preventing CORS issues in Capacitor
    if (!isServer && process.env.NODE_ENV === 'production') {
      // Check if we're building for native platforms (you can add a build flag if needed)
      // For now, we'll allow Firebase Web SDK to be bundled for web builds
      // The cross-platform abstraction in the code will handle the platform detection
      
      // Only block if explicitly building for native
      if (process.env.BUILD_FOR_NATIVE === 'true') {
        // Block all Firebase Web SDK modules from being bundled for native builds
        config.resolve.alias['firebase/app'] = false;
        config.resolve.alias['firebase/auth'] = false;
        config.resolve.alias['firebase/firestore'] = false;
        config.resolve.alias['firebase/analytics'] = false;
        config.resolve.alias['firebase/storage'] = false;
        config.resolve.alias['firebase/messaging'] = false;
        config.resolve.alias['firebase/functions'] = false;
        config.resolve.alias['firebase/remote-config'] = false;
        config.resolve.alias['firebase/performance'] = false;
        config.resolve.alias['firebase/crashlytics'] = false;
        
        // Add fallback for Firebase modules to prevent bundling errors
        config.resolve.fallback = {
          ...config.resolve.fallback,
          'firebase/app': false,
          'firebase/auth': false,
          'firebase/firestore': false,
          'firebase/analytics': false,
          'firebase/storage': false,
          'firebase/messaging': false,
          'firebase/functions': false,
          'firebase/remote-config': false,
          'firebase/performance': false,
          'firebase/crashlytics': false,
        };
      }
    }
    return config;
  },
};

export default nextConfig;
