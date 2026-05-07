import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bb54c80d890c40f1b3c043fbc3b9a6f9',
  appName: 'Memory Help',
  webDir: 'dist',
  server: {
    url: 'https://bb54c80d-890c-40f1-b3c0-43fbc3b9a6f9.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
    },
  },
};

export default config;
