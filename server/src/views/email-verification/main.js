import { params } from './parseUrlParams.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const { status, message } = params();

  container.innerHTML =
    status === 'success'
      ? `
    <div class="flex flex-col items-center justify-center gap-1">
      <i class="fa-solid fa-check text-2xl"></i>
      <span>${message}</span>
      <button id="btn-login" class="rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-700">Login</button>
    </div>
    `
      : `
    <div class="flex flex-col items-center justify-center gap-1">
      <i class="fa-solid fa-xmark text-2xl"></i>
      <span>${message}</span>
    </div>
    `;

  if (status === 'success') {
    document.getElementById('btn-login').addEventListener('click', () => {
      window.location.href = 'http://localhost:5173/login';
    });
  }
});
