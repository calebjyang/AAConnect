import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aacf.aaconnect',
  appName: 'AAConnect',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
