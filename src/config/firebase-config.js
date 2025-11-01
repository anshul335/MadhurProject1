export const firebaseConfig = {
  apiKey: "AIzaSyD9_Ech69TlN2Iw6fNuJFrxD2FnGY9EC2I",
  authDomain: "smiling-rhythm-458113-p4.firebaseapp.com",
  projectId: "smiling-rhythm-458113-p4",
  storageBucket: "smiling-rhythm-458113-p4.firebasestorage.app",
  messagingSenderId: "506882005035",
  appId: "1:506882005035:web:8f5d6bb2711e39a4f2726e",
  measurementId: "G-K0X47Z7MWN"
};

// Global variables (set by environment or fall back to projectId/null)
const ENV_CONFIG = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
export const FINAL_CONFIG = ENV_CONFIG.apiKey ? ENV_CONFIG : firebaseConfig;

export const ENV_APP_ID = typeof __app_id !== 'undefined' ? __app_id : FINAL_CONFIG.projectId;
export const ENV_AUTH_TOKEN = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

export const LANGUAGES = {
  'javascript': { color: 'text-yellow-400', name: 'JavaScript' },
  'python': { color: 'text-blue-400', name: 'Python' },
  'html': { color: 'text-red-400', name: 'HTML' },
  'css': { color: 'text-cyan-400', name: 'CSS' },
  'markdown': { color: 'text-gray-400', name: 'Markdown' },
  'generic': { color: 'text-indigo-400', name: 'Generic' }
};

export const APP_ID = ENV_APP_ID;
export const INITIAL_AUTH_TOKEN = ENV_AUTH_TOKEN;