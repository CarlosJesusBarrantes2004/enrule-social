export const errorClass =
  'rounded-md flex flex-col items-center justify-center gap-2 p-4 bg-red-200 border border-red-500';
export const successClass =
  'rounded-md flex flex-col items-center justify-center gap-2 p-4 bg-green-200 border border-green-500';

export const formHandler = async (event, messageContainer, form, id) => {
  event.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  messageContainer.innerHTML = '';
  messageContainer.classList = '';

  if (!password || !confirmPassword) {
    messageContainer.innerHTML = `
      <div class="${errorClass}">
        <i class="fa-solid fa-xmark text-2xl"></i>
        <span>Please fill in all fields</span>
      </div>
    `;
    return;
  }

  if (password !== confirmPassword) {
    messageContainer.innerHTML = `
      <div class="${errorClass}">
        <i class="fa-solid fa-xmark text-2xl"></i>
        <span>Passwords must be the same</span>
      </div>
    `;
    return;
  }

  try {
    const result = await fetch(`http://localhost:3000/users/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });

    const response = await result.json();

    if (response.ok) {
      messageContainer.innerHTML = `
        <div class="${successClass}">
          <i class="fa-solid fa-check text-2xl"></i>
          <span>Password reset successful</span>
          <button id="btn-login" class="rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-700">
            Login
          </button>
        </div>
      `;
      form.classList.add('hidden');

      document.getElementById('btn-login').addEventListener('click', () => {
        window.location.href = 'http://localhost:5173/login';
      });
    } else {
      messageContainer.innerHTML = `
        <div class="${errorClass}">
          <i class="fa-solid fa-xmark text-2xl"></i>
          <span>Failed to reset password</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
    messageContainer.innerHTML = `
      <div class="${errorClass}">
        <i class="fa-solid fa-xmark text-2xl"></i>
        <span>An error occurred</span>
      </div>
    `;
  }
};
