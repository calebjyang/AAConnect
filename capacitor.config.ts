import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aacf.aaconnect',
  appName: 'AAConnect',
  webDir: 'out',
  server: {
    hostname: 'localhost',
    iosScheme: 'https',
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
