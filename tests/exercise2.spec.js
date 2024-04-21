// @ts-check
const { test, expect } = require('@playwright/test');

test('Login page functionality invalid login', async ({ page }) => {
  await page.goto('https://club-administration.qa.qubika.com/#/auth/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Qubika Club/);
    // Check if there are input fields for username/email and password
    const usernameInput = await page.waitForSelector('input[formcontrolname="email"]');
    expect(usernameInput).toBeTruthy(); 
    const passwordInput = await page.waitForSelector('input[formcontrolname="password"]');
    expect(passwordInput).toBeTruthy();
    // Check if there is a submit button
   const submitButton = await page.waitForSelector('button[type="submit"]');
   expect(submitButton).toBeTruthy();

  // Test submitting the form with invalid credentials
  await usernameInput.fill('invalid_username_or_email');
  await passwordInput.fill('invalid_password');
  await submitButton.click();
    // Check if error message is displayed
    const errorMessage = await page.waitForSelector('div[aria-label="Usuario o contraseña incorrectos"]');
    expect(errorMessage).toBeTruthy();
      // Assert the text content of the error message
  const errorMessageText = await page.evaluate(el => el.textContent, errorMessage);
  // @ts-ignore
  expect(errorMessageText.trim()).toBe('Usuario o contraseña incorrectos');

});


test('End-to-end user registration and login', async ({ page }) => {
  // Generate random email and password for user registration
  const randomEmail = `testuser_${Date.now()}@example.com`;
  const randomPassword = 'testpassword';

  // Create the payload for user registration
  const payload = {
    email: randomEmail,
    password: randomPassword,
    roles: ['ROLE_ADMIN']
  };

  // Log the request payload before sending
  console.log('Request payload:', payload);

  // Make a POST request to register a new user
  const registerResponse = await page.evaluate(async (payload) => {
    const response = await fetch('https://api.club-administration.qa.qubika.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json(); // Return the JSON data directly
  }, payload);

  // Log the response status and body
  console.log(registerResponse);

  // Assertions for registerResponse properties
  expect(registerResponse.id).toBeDefined();
  expect(registerResponse.userName).toMatch(/^testuser_\d+$/);
  expect(registerResponse.email).toBe(randomEmail);
  expect(registerResponse.password).toBeDefined();
  expect(registerResponse.roles).toEqual(['ROLE_ADMIN']);
  expect(registerResponse.firstName).toBeNull();
  expect(registerResponse.lastName).toBeNull();
  expect(registerResponse.fullName).toBeNull();
  // Navigate to the login page
  await page.goto('https://club-administration.qa.qubika.com/#/auth/login');

  // Fill in the login form with the registered user's credentials
  await page.fill('input[formcontrolname="email"]', randomEmail);
  await page.fill('input[formcontrolname="password"]', randomPassword);
  await page.click('button[type="submit"]');

  // Wait for navigation to the dashboard or any other expected page after login
  await page.waitForURL('https://club-administration.qa.qubika.com/#/dashboard');  
  // Assert that the user is logged in and redirected to the expected page
  expect(page.url()).toBe('https://club-administration.qa.qubika.com/#/dashboard');
 
  // Click on the anchor element to navigate to the Category page
    await page.click('a[href="#/category-type"]');

    // Wait for the Category page to load
    await page.waitForURL("https://club-administration.qa.qubika.com/#/category-type");
  
    // Optional: Validate that you are on the Category page
    const url = page.url();
    expect(url).toContain('#/category-type');

  // Assert that the Category page header is present
  const categoryPageHeader = await page.$eval('h3.mb-0', header => header.textContent);
  expect(categoryPageHeader).toBe('Tipos de categorías');
    // Wait for the button to become visible
    await page.waitForSelector('button.btn-primary');

    // Click the "Adicionar" button
    await page.click('button.btn-primary');

      // Wait for the input field to become visible
  await page.waitForSelector('input#input-username');

  // Generate a dynamic category name (you can use a timestamp or a random string generator)
  const categoryName = `Category_${Date.now()}`;

  // Fill the input field with the generated category name
  await page.fill('input#input-username', categoryName);
  await page.waitForTimeout(500);
  // Check if the "Aceptar" button is enabled
  const isButtonEnabled = await page.$eval('button.btn-primary:text("Aceptar")', button => button.getAttribute('aria-disabled') !== 'true');

  // If the button is enabled, click on it
  if (isButtonEnabled) {
    await page.click('button.btn-primary:text("Aceptar")');
  } else {
    console.log('"Aceptar" button is disabled.');
  }
  // Wait for the success message element to appear
  const successMessageElement = await page.waitForSelector('div[role="alertdialog"]');

  // Check if the success message element is found
  if (successMessageElement) {
    // Retrieve the text content of the success message element
    const successMessage = await successMessageElement.textContent();

    // Assert that the success message matches the expected message
    expect(successMessage?.trim()).toBe('Tipo de categoría adicionada satisfactoriamente');
  } else {
    // If the success message element is not found, fail the test
    throw new Error('Success message element not found');
  }
  
  await page.waitForTimeout(500);

  const liElements = await page.$$('ul.pagination li');

  const lastLiElement = liElements[liElements.length - 2];
  // Click on the second-to-last li element
  await lastLiElement.click();

  // Wait for a short interval to allow the class change to take effect
  await page.waitForTimeout(500);

  // Get the updated class attribute of the last li element
  const updatedClass = await lastLiElement.getAttribute('class');

  // Assert that the updated class attribute contains "active"
  expect(updatedClass).toContain('active');


  // Get all <tr> elements
  const trElements = await page.$$('tr');

  // Get the last <tr> element
  const lastTrElement = trElements[trElements.length - 1];

  // Find the first <td> element within the last <tr> row
  const firstTdElement = await lastTrElement.$('td');
  
  if (firstTdElement !== null) {
    const tdTextContent = await firstTdElement.textContent();
       if (tdTextContent !== null) {
          expect(tdTextContent.includes(categoryName)).toBeTruthy();
       } else {
          throw new Error('Failed to retrieve text content of the first <td> element');
       }
  } else {
    throw new Error('Failed to retrieve the first <td> element');
  }
}
);
