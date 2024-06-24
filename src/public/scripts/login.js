document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submitButton');
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(inputElement, errorMessage) {
    const errorElement = inputElement.nextElementSibling;
    errorElement.textContent = errorMessage;
    errorElement.classList.remove('hidden');
  }

  function hideError(inputElement) {
    const errorElement = inputElement.nextElementSibling;
    errorElement.classList.add('hidden');
  }

  function validateForm() {
    const emailValid = validateEmail(emailInput.value.trim());
    const passwordValid = passwordInput.value.trim().length >= 6;

    if (emailValid && passwordValid) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  emailInput.addEventListener('blur', function() {
    if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Email is invalid');
    } else {
      hideError(emailInput);
    }
    validateForm();
  });

  passwordInput.addEventListener('blur', function() {
    if (passwordInput.value.trim().length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters long');
    } else {
      hideError(passwordInput);
    }
    validateForm();
  });

  passwordInput.addEventListener('keyup', function() {
    if (passwordInput.value.trim().length >= 6) {
      hideError(passwordInput);
    }
    validateForm();
  });
  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
  });
});