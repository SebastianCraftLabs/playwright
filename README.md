# playwright
This was my first time using Playwright so I'm sure it would have a lot of improvements to be made, nevertheless I understood the exercise and I verify login page as requested and added an extra test to verify error message on error login.

E2E test: I'm not a big fan of e2e test this complex due to all moving parts can interrupt the test making maintanence very expensive, thats why I would prefer to test the modules separetly and not all togehter, however I do understand the importance of e2e and why we want to UAT and get the complete flow that the user might do. It was a great challenge.

Install Node.js:
Before installing Playwright, ensure you have Node.js installed on your machine. You can download and install Node.js from the official website: Node.js Downloads.

Install Playwright:
Install Playwright as a dependency in your project using npm or yarn:

npm install playwright

This command will install Playwright along with its dependencies in your project.

You can run the test with following commands.
 npx playwright test --ui
 or
 npx playwright test

Explanation of Code

The code provided earlier demonstrates writing end-to-end tests using Playwright. Here's an explanation of the code:

    Test Structure:
    The code is written using the Playwright test runner. Each test is defined using the test function, which takes a name and an async function as arguments.

    Navigating to a URL:
    The test begins by navigating to a login page URL using page.goto().

    Assertions:
    Playwright provides built-in assertion methods to validate the state of the page. In the code, assertions are made using expect() to check various conditions such as page title, element presence, and element content.

    Interacting with Elements:
    The code demonstrates interacting with input fields and buttons on the page. For example, filling in a username input field and clicking on a login button.

    Asynchronous Operations:
    Playwright operates asynchronously, so many operations return promises. You'll notice the use of await before most Playwright functions, indicating that the code is awaiting the completion of the corresponding asynchronous operation.

    Handling API Calls:
    The code demonstrates making an API call within the test using fetch() to register a new user before logging in.

    Error Handling:
    Error handling is important in test automation. The code handles errors that may occur during the test execution, such as assertion failures or exceptions thrown during API calls.

    Page Navigation:
    The code demonstrates waiting for page navigation to complete using page.waitForNavigation() and verifying the URL after navigation.