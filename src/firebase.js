import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// As chaves podem vir de variáveis de ambiente .env ou de configuração manual no app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Checa se o Firebase real possui API Key válida preenchida
export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  firebaseConfig.projectId !== ""
);

let app = null;
let db = null;
let auth = null;

if (isLiveFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Firebase Live ativado com sucesso!");
  } catch (err) {
    console.warn("⚠️ Falha ao inicializar Firebase real, alternando para Local Store:", err);
  }
} else {
  console.log("⚡ Executando em Modo Demo / LocalStorage Reativo. (Insira as chaves Firebase para Live Mode)");
}

export { app, db, auth };
