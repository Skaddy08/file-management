window.onload = function () {
  console.log("Register form loaded.");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("submitButton");

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 6;
  }

  function validateUsername() {
    const usernameValid = usernameInput.value.trim() !== "";
    usernameError.classList.toggle("hidden", usernameValid);
    validateForm();
  }

  function validateEmail() {
    const emailValid = isValidEmail(emailInput.value.trim());
    emailError.classList.toggle("hidden", emailValid);
    validateForm();
  }

  function validatePassword() {
    const passwordValid = isValidPassword(passwordInput.value.trim());
    passwordError.classList.toggle("hidden", passwordValid);
    validateForm();
  }

  function validateForm() {
    console.log("Validating form...");

    const usernameValid = usernameInput.value.trim() !== "";
    const emailValid = isValidEmail(emailInput.value.trim());
    const passwordValid = isValidPassword(passwordInput.value.trim());

    submitButton.disabled = !(usernameValid && emailValid && passwordValid);
  }

  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);

  submitButton.addEventListener("click", function(event) {
    if (submitButton.disabled) {
      event.preventDefault();
      console.log("Form not submitted. Please fill all fields correctly.");
    } else {
      console.log("Form submitted.");
    }
  });
};
