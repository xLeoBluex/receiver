// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// --- UI LOGIC HELPERS ---

// Helper function to show toast messages
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('successToast');
  if (!toast) return;

  toast.classList.remove('error');
  if (isSuccess) {
    toast.textContent = `✅ ${message}`;
  } else {
    toast.classList.add('error');
    toast.textContent = `❌ ${message}`;
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Create animated particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  particlesContainer.innerHTML = ''; // Clear existing particles
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 8 + 3;
    const positionX = Math.random() * window.innerWidth;
    const positionY = Math.random() * window.innerHeight;
    const animationDelay = Math.random() * 8;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${positionX}px`;
    particle.style.top = `${positionY}px`;
    particle.style.animationDelay = `${animationDelay}s`;

    particlesContainer.appendChild(particle);
  }
}

// --- INITIALIZATION ---

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get form elements
const form = document.getElementById("comunicadoForm");
const tituloInput = document.getElementById('titulo');
const mensagemTextarea = document.getElementById('mensagem');
const charCounter = document.getElementById('charCounter');
const submitBtn = form.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const loading = submitBtn.querySelector('.loading');

// --- EVENT LISTENERS ---

// Character counter
if (mensagemTextarea && charCounter) {
  mensagemTextarea.addEventListener('input', function() {
    const length = this.value.length;
    charCounter.textContent = `${length} caracteres`;

    if (length > 500) {
      charCounter.style.color = '#f44336';
    } else if (length > 300) {
      charCounter.style.color = '#ff9800';
    } else {
      charCounter.style.color = '#999';
    }
  });
}

// Real-time validation
if (tituloInput) {
  tituloInput.addEventListener('input', function() {
    if (this.value.length >= 3) {
      this.classList.add('input-valid');
      this.classList.remove('input-invalid');
    } else if (this.value.length > 0) {
      this.classList.add('input-invalid');
      this.classList.remove('input-valid');
    } else {
      this.classList.remove('input-valid', 'input-invalid');
    }
  });
}

if (mensagemTextarea) {
  mensagemTextarea.addEventListener('input', function() {
    if (this.value.length >= 10) {
      this.classList.add('input-valid');
      this.classList.remove('input-invalid');
    } else if (this.value.length > 0) {
      this.classList.add('input-invalid');
      this.classList.remove('input-valid');
    } else {
      this.classList.remove('input-valid', 'input-invalid');
    }
  });
}

// Form submission handler
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = tituloInput.value;
    const mensagem = mensagemTextarea.value;

    // Validation
    if (!titulo.trim() || !mensagem.trim()) {
      return showToast('Por favor, preencha todos os campos!', false);
    }
    if (titulo.length < 3) {
      return showToast('O título deve ter pelo menos 3 caracteres!', false);
    }
    if (mensagem.length < 10) {
      return showToast('A mensagem deve ter pelo menos 10 caracteres!', false);
    }

    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'flex';
    submitBtn.disabled = true;

    try {
      // Send data to Firebase
      await addDoc(collection(db, "comunicados"), {
        titulo,
        mensagem,
        criadoEm: serverTimestamp()
      });

      // Success UI
      showToast("Comunicado enviado com sucesso!");
      form.reset();
      if (charCounter) charCounter.textContent = '0 caracteres';
      tituloInput.classList.remove('input-valid', 'input-invalid');
      mensagemTextarea.classList.remove('input-valid', 'input-invalid');

    } catch (error) {
      // Error UI
      console.error("Erro ao enviar comunicado: ", error);
      showToast("Erro ao enviar comunicado.", false);
    } finally {
      // Reset button state
      btnText.style.display = 'block';
      loading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

// Particle animation listeners
window.addEventListener('load', createParticles);
window.addEventListener('resize', createParticles);

