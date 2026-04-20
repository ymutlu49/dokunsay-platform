import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dokunsay.app",
  appName: "DokunSay",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#f0ead6",
      showSpinner: false,
      launchShowDuration: 1500,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#c8cfbe",
    },
  },
};

export default config;
