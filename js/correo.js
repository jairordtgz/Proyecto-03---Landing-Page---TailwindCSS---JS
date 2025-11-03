// js/enviarCorreo.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCorreo");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const opcion = document.getElementById("opcion").value;

    if (!correo || !opcion) {
      mensaje.textContent = "⚠️ Por favor completa todos los campos.";
      mensaje.style.color = "#f87171"; // rojo
      return;
    }

    try {
      // Simulación de envío (POST)
      const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          espacio: opcion,
          mensaje: "Gracias por registrarte. Te contactaremos pronto.",
        }),
      });

      const data = await respuesta.json();

      mensaje.textContent = `✅ Correo enviado con éxito a ${data.email} para el espacio "${opcion}".`;
      mensaje.style.color = "#4ade80"; // verde
      form.reset();

    } catch (error) {
      console.error(error);
      mensaje.textContent = "❌ Error al enviar el formulario.";
      mensaje.style.color = "#f87171"; // rojo
    }
  });
});
