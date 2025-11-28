import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

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