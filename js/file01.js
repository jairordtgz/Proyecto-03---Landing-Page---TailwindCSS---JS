import { fetchProducts, fetchCategories } from "./functions.js";
"use strict";
import { saveVotes, listenVotes } from "./firebase.js";




let enableForm = () => {
    const form = document.getElementById("form_voting");
    const statusEl = document.getElementById("vote_status");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const feature = formData.get("feature");
            if (!feature) {
                if (statusEl) statusEl.textContent = "Selecciona una opción.";
                return;
            }

            if (statusEl) statusEl.textContent = "Guardando voto...";
            saveVotes(feature).then((response) => {
                if (response.status) {
                    if (statusEl) statusEl.textContent = "Voto guardado ✔";
                } else {
                    if (statusEl) statusEl.textContent = "Error guardando voto";
                }

                // limpiar selección (permitir votos ilimitados pero dar feedback)
                form.reset();
                setTimeout(() => {
                    if (statusEl) statusEl.textContent = "";
                }, 2000);
            });
        });
    }
}

const renderPodium = (counts) => {
    const container = document.getElementById("vote_podium");
    if (!container) return;

    // lista de features con etiquetas legibles
    const items = [
        { id: "checkin_qr", label: "Check in / out (QR)" },
        { id: "report_loss", label: "Reportar pérdida / daño" },
        { id: "repeat_reservations", label: "Repetir reservas" },
        { id: "chat_admin", label: "Chat con administradores" },
    ];

    const maxCount = Math.max(...Object.values(counts), 1);

    // ordenar por conteo desc
    items.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));

    container.innerHTML = "";
    items.forEach((it, index) => {
        const value = counts[it.id] || 0;
        const percent = Math.round((value / maxCount) * 100);

        const row = document.createElement("div");
        row.className = "tw-flex tw-flex-col tw-gap-1 tw-py-2 tw-px-2 tw-bg-[#0b0b0b] tw-rounded";
        row.innerHTML = `
            <div class="tw-flex tw-justify-between">
                <div class="tw-font-medium">${index + 1}. ${it.label}</div>
                <div class="tw-font-semibold">${value} votos</div>
            </div>
            <div class="tw-h-2 tw-w-full tw-bg-gray-800 tw-rounded">
                <div class="tw-h-2 tw-bg-[#7e22ce] tw-rounded" style="width: ${percent}%"></div>
            </div>
        `;

        container.appendChild(row);
    });
};

(() => {
    showToast();
    showVideo(); 
    renderProducts(); 
    renderCategories();
        enableForm();

        // Iniciar escucha en tiempo real de votos y actualizar podio
        listenVotes((counts) => {
            renderPodium(counts);
        });
})();