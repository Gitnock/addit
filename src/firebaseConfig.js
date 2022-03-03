import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const config = {
  apiKey: import.meta.env.VUE_APP_API_KEY,
  authDomain: import.meta.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VUE_APP_DATABASE_URL,
  projectId: import.meta.env.VUE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VUE_APP_APP_ID,
  measurementId: import.meta.env.VUE_MEASUREMENT_ID,
};

const app = initializeApp(config);
const analytics = getAnalytics(app);

export { analytics };
