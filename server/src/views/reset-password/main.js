import { params } from './parseUrlParams.js';
import { formHandler, errorClass, successClass } from './formHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-password');
  const messageContainer = document.getElementById('message-container');

  const { status, message, type, id } = params();

  // Mostrar mensaje si existe
  if (message) {
    messageContainer.innerHTML = `
      <div class="${status === 'error' ? errorClass : successClass}">
        <i class="fa-solid ${
          status === 'error' ? 'fa-xmark' : 'fa-check'
        } text-2xl"></i>
        <span>${decodeURIComponent(message)}</span>
      </div>
    `;
  }

  // Mostrar formulario solo si es tipo 'reset' y hay un ID
  if (type === 'reset' && id) form.classList.remove('hidden');

  // Manejar el envío del formulario
  form.addEventListener('submit', (event) =>
    formHandler(event, messageContainer, form, id)
  );
});
