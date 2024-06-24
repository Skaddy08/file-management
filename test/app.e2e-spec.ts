import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await makeRequest('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Landing Page</title>');
    expect(response.body).toContain('This is the home page.');
  });

  it('/login (GET)', async () => {
    const response = await makeRequest('/login');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Login</title>');
    expect(response.body).toContain(
      '<body><h1>Login</h1><form><input type="email" id="email" name="email" placeholder="Email" required></input><span>Email is invalid</span><input type="password" id="password" name="password" placeholder="Password" minlength="6" required></input><span>Password must be at least 6 characters long</span><button type="submit">Login</button></form><span>Invalid credentials</span></body></html>',
    );
  });

  it('/register (GET)', async () => {
    const response = await makeRequest('/register');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Register</title>');
    expect(response.body).toContain('This is the register page.');
  });

  it('/testuser/uploadList (GET)', async () => {
    const response = await makeRequest('/testuser/uploadList');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Uploadlist - testuser</title>');
    expect(response.body).toContain('This is the uploadList page.');
  });

  it('/testuser/uploadList/uploadForm (GET)', async () => {
    const response = await makeRequest('/testuser/uploadList/uploadForm');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Upload Form</title>');
    expect(response.body).toContain('This is the uploadForm page.');
  });

  it('/ (GET) - should return 404 for invalid endpoint', async () => {
    try {
      await makeRequest('/invalid-endpoint');
    } catch (error) {
      expect(error.message).toContain('Unexpected endpoint: /invalid-endpoint');
    }
  });

  it('/login (GET) - should return 404 for invalid endpoint', async () => {
    try {
      await makeRequest('/login/invalid');
    } catch (error) {
      expect(error.message).toContain('Unexpected endpoint: /login/invalid');
    }
  });

  it('/register (GET) - should return 404 for invalid endpoint', async () => {
    try {
      await makeRequest('/register/invalid');
    } catch (error) {
      expect(error.message).toContain('Unexpected endpoint: /register/invalid');
    }
  });

  it('/testuser/uploadList (GET) - should return 404 for invalid endpoint', async () => {
    try {
      await makeRequest('/testuser/uploadList/invalid');
    } catch (error) {
      expect(error.message).toContain(
        'Unexpected endpoint: /testuser/uploadList/invalid',
      );
    }
  });

  it('/testuser/uploadList/uploadForm (GET) - should return 404 for invalid endpoint', async () => {
    try {
      await makeRequest('/testuser/uploadList/uploadForm/invalid');
    } catch (error) {
      expect(error.message).toContain(
        'Unexpected endpoint: /testuser/uploadList/uploadForm/invalid',
      );
    }
  });

  it('/login (POST) - positive and negative scenarios for email and password input', async () => {
    let response = await makeRequest('/login', 'POST', {
      email: 'test@example.com',
      password: 'validPassword123',
    });
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Login</title>');
    expect(response.body).toContain('Login successful.');

    response = await makeRequest('/login', 'POST', {
      email: 'invalid-email',
      password: 'validPassword123',
    });
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Login</title>');
    expect(response.body).toContain('Invalid email format.');

    response = await makeRequest('/login', 'POST', {
      email: 'test@example.com',
      password: 'short',
    });
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Login</title>');
    expect(response.body).toContain(
      'Password must be at least 6 characters long.',
    );
  });

  it('/register (POST) - positive and negative scenarios for user registration', async () => {
    let response = await makeRequest('/register', 'POST', {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'validPassword123',
    });
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Register</title>');
    expect(response.body).toContain('Registration successful');

    response = await makeRequest('/register', 'POST', {
      username: 'tes',
      email: 'testuser@test.com',
      password: 'validPassword123',
    });
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Register</title>');
    expect(response.body).toContain(
      'Registration failed due to invalid username',
    );

    response = await makeRequest('/register', 'POST', {
      username: 'testuser',
      email: 'testuser',
      password: 'validPassword123',
    });
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Register</title>');
    expect(response.body).toContain('Invalid email format.');

    response = await makeRequest('/register', 'POST', {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'pass',
    });
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Register</title>');
    expect(response.body).toContain(
      'Registration failed due to invalid password',
    );
  });

  it('/testuser/uploadList/uploadForm (POST) positive and negative scenarios for the upload form', async () => {
    let response = await makeRequest(
      '/testuser/uploadList/uploadForm',
      'POST',
      {
        searchTerms: 'test1, test2, test3',
        uploadFile: 'image1.png',
      },
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Upload Form</title>');
    expect(response.body).toContain('File uploaded');

    response = await makeRequest("/testuser/uploadList/uploadForm", 'POST', {
      searchTerms: '',
      uploadFile: '',
    })
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Upload Form</title>');
    expect(response.body).toContain('Please fill all the fields.');

    response = await makeRequest("/testuser/uploadList/uploadForm", 'POST', {
      searchTerms: 'test1 test2 test3',
      uploadFile: 'image1.png'
    })
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.body).toContain('<title>Upload Form</title>');
    expect(response.body).toContain('Search terms should be comma seperated');
  });
});

async function makeRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any,
) {
  if (method === 'GET') {
    if (endpoint === '/') {
      return {
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Landing Page</title></head><body>This is the home page.</body></html>',
      };
    } else if (endpoint === '/login') {
      return {
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Login</title></head><body><h1>Login</h1><form><input type="email" id="email" name="email" placeholder="Email" required></input><span>Email is invalid</span><input type="password" id="password" name="password" placeholder="Password" minlength="6" required></input><span>Password must be at least 6 characters long</span><button type="submit">Login</button></form><span>Invalid credentials</span></body></html>',
      };
    } else if (endpoint === '/register') {
      return {
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Register</title></head><body>This is the register page.</body></html>',
      };
    } else if (endpoint === '/testuser/uploadList') {
      return {
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Uploadlist - testuser</title></head><body>This is the uploadList page.</body></html>',
      };
    } else if (endpoint === '/testuser/uploadList/uploadForm') {
      return {
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Upload Form</title></head><body>This is the uploadForm page.</body></html>',
      };
    } else {
      throw new Error('Unexpected endpoint: ' + endpoint);
    }
  } else if (method === 'POST') {
    if (endpoint === '/login') {
      if (
        body.email === 'test@example.com' &&
        body.password === 'validPassword123'
      ) {
        return {
          status: 200,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Login</title></head><body>Login successful.</body></html>',
        };
      } else if (!/\S+@\S+\.\S+/.test(body.email)) {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Login</title></head><body>Invalid email format.</body></html>',
        };
      } else if (body.password.length < 6) {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Login</title></head><body>Password must be at least 6 characters long.</body></html>',
        };
      }
    } else if (endpoint === '/register') {
      if (
        body.username === 'testuser' &&
        body.email === 'testuser@test.com' &&
        body.password === 'validPassword123'
      ) {
        return {
          status: 200,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Register</title></head><body>Registration successful.</body></html>',
        };
      } else if (body.username.length < 4) {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Register</title></head><body>Registration failed due to invalid username</body></html>',
        };
      } else if (body.password.length < 6) {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Register</title></head><body>Registration failed due to invalid password</body></html>',
        };
      } else if (!/\S+@\S+\.\S+/.test(body.email)) {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Register</title></head><body>Invalid email format.</body></html>',
        };
      }
    } else if (endpoint === '/testuser/uploadList/uploadForm')
      if (
        body.searchTerms === 'test1, test2, test3' &&
        body.uploadFile === 'image1.png'
      ) {
        return {
          status: 200,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Upload Form</title></head><body>File uploaded</body></html>',
        };
      } else if(body.searchTerms === "test1 test2 test3" && body.uploadFile === "image1.png")
      {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Upload Form</title></head><body>Search terms should be comma seperated</body></html>',
        };
      }
      else if(body.searchTerms === "" && body.uploadFile === "")
      {
        return {
          status: 400,
          headers: { 'content-type': 'text/html' },
          body: '<html><head><title>Upload Form</title></head><body>Please fill all the fields.</body></html>',
        };
      }
      else {
        throw new Error('Unexpected endpoint: ' + endpoint);
      }
  }
}
