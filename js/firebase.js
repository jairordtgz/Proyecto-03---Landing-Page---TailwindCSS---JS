import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Soporte para sitio estático: primero intenta tomar `window.FIREBASE_CONFIG` (añadir
// un <script> en index.html). Si no existe, intenta leer `import.meta.env` (Vite).
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const winCfg = (typeof window !== 'undefined' && window.FIREBASE_CONFIG) ? window.FIREBASE_CONFIG : null;

const firebaseConfig = winCfg || {
    apiKey: env.VITE_FIREBASE_API_KEY || "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: env.VITE_FIREBASE_APP_ID || "",
    // opcional: databaseURL: env.VITE_FIREBASE_DATABASE_URL || "",
};

// Validación básica para ayudar a debuggear
if (!firebaseConfig || !firebaseConfig.apiKey) {
    console.error("Firebase configuration missing. Define window.FIREBASE_CONFIG in index.html or set VITE_FIREBASE_* env variables.");
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVotes = (featureId) => {
    const votesRef = ref(database, "votes");
    const newVoteRef = push(votesRef);

    return set(newVoteRef, {
        featureId: featureId,
        timestamp: Date.now(),
    })
        .then(() => {
            return {
                status: true,
                message: "Voto guardado correctamente",
            };
        })
        .catch((error) => {
            console.error("Error saving vote: ", error);
            return {
                status: false,
                message: "Error al guardar voto",
            };
        });
};

// Escucha en tiempo real los votos y devuelve un objeto con conteos por feature
const listenVotes = (onCounts) => {
    const votesRef = ref(database, "votes");
    return onValue(votesRef, (snapshot) => {
        const data = snapshot.val() || {};
        const counts = {
            checkin_qr: 0,
            report_loss: 0,
            repeat_reservations: 0,
            chat_admin: 0,
        };

        Object.keys(data).forEach((key) => {
            const item = data[key];
            const f = item && item.featureId;
            if (f && counts.hasOwnProperty(f)) counts[f]++;
        });

        if (typeof onCounts === "function") onCounts(counts);
    });
};

export { saveVotes, listenVotes };