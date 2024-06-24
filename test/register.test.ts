// register.test.ts
import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const baseDir = process.cwd();

describe('Register Form Validation', () => {
  let dom;
  let document;

  beforeAll(async () => {
    const htmlPath = path.resolve(baseDir, 'path/to/your/register.html');
    const scriptPath = path.resolve(baseDir, 'path/to/your/scripts/register.js');

    const html = await fs.readFile(htmlPath, 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    document = dom.window.document;

    const scriptContent = await fs.readFile(scriptPath, 'utf8');
    const scriptElement = document.createElement('script');
    scriptElement.textContent = scriptContent;
    document.head.appendChild(scriptElement);
  });

  test('should load the form', () => {
    expect(document.querySelector('form#registerForm')).not.toBeNull();
  });

  test('should validate empty username', () => {
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('usernameError');

    usernameInput.value = '';
    usernameInput.dispatchEvent(new dom.window.Event('blur'));

    expect(usernameError.classList.contains('hidden')).toBe(false);
  });

  test('should validate invalid email', () => {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new dom.window.Event('blur'));

    expect(emailError.classList.contains('hidden')).toBe(false);
  });

  test('should validate short password', () => {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');

    passwordInput.value = '123';
    passwordInput.dispatchEvent(new dom.window.Event('blur'));

    expect(passwordError.classList.contains('hidden')).toBe(false);
  });

  test('should enable submit button for valid inputs', () => {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submitButton');

    usernameInput.value = 'validuser';
    emailInput.value = 'valid@example.com';
    passwordInput.value = 'validpassword';
    
    usernameInput.dispatchEvent(new dom.window.Event('blur'));
    emailInput.dispatchEvent(new dom.window.Event('blur'));
    passwordInput.dispatchEvent(new dom.window.Event('blur'));

    expect(submitButton.disabled).toBe(false);
  });
});
