import React from "react";
import { fireEvent, render, cleanup, screen } from "@testing-library/react";
import Register from "@/app/register/page";
import { useRouter } from "next/router";
import { get } from "https";
import "jest-fetch-mock";

// Mock the `useRouter` function because it cant be used outside  the context of approuter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => jest.fn(),
    };
  },
}));
//replaces real fetch with mock version that will always display login successful and mock alert
beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock `alert` for every test
  fetchMock.resetMocks(); // Reset mock fetch before each test
  fetchMock.mockResponse(() =>
    Promise.resolve(JSON.stringify({ messsage: "Success your registered!" }))
  );
  //   jest.spyOn(console, "log").mockImplementation(() => {});
  //   console.log.mockRestore();
});

afterEach(() => {
  (window.alert as jest.Mock).mockRestore(); // Restore `alert` after each test
});

//test that empty email fails form submission
it("Register Test Empty Email field", async () => {
  //render is used to render given component
  const { getByTestId } = render(<Register />);
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const username = "test123456";
  const password = "hellloo111111";
  const confirmPassword = "hellloo111111";
  fireEvent.change(emailInput, { target: { value: "" } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue("");
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith("Email is required");
});

//test that empty password fails form submission
it("Register Test Empty Password field", async () => {
  //render is used to render given component
  const { getByTestId } = render(<Register />);
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const username = "test123456";
  const email = "hellloo@gmail.com";
  const confirmPassword = "hellloo111111";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: "" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue("");
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith(
    "password is a required field\nPassword must be at least 8 characters long\nPasswords must match"
  );
});

//test that empty confirm password fails form submission
it("Register Test Empty Confirm Password field", async () => {
  //render is used to render given component
  const { getByTestId } = render(<Register />);
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const username = "test123456";
  const email = "hellloo@gmail.com";
  const password = "hellloo111111";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "" },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue("");
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith("Passwords must match");
});

//test that empty username fails form submission
it("Register Test Empty Username field", async () => {
  //render is used to render given component
  const { getByTestId } = render(<Register />);
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const confirmPassword = "hellloo111111";
  const email = "hellloo@gmail.com";
  const password = "hellloo111111";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: "" } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue("");
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith(
    "username is a required field\nUsername must be at least 3 characters long"
  );
});

//test that empty username fails form submission
it("Register Test Passwords do not match", async () => {
  //render is used to render given component
  const { getByTestId } = render(<Register />);
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const confirmPassword = "hellloo111111";
  const email = "hellloo@gmail.com";
  const password = "hellloo111112";
  const username = "test123456";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith("Passwords must match");
});

//test that email already used fails form submission
it("Register Test Email already in use", async () => {
  //render is used to render given component

  const { getByTestId } = render(<Register />);
  //   const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const confirmPassword = "hellloo111111";
  const email = "newTesting@gmail.com";
  const password = "hellloo111111";
  const username = "newTestUser222";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).toHaveBeenCalledWith(
    "https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register",
    expect.any(Object)
  );
});

//test that empty username fails form submission
it("Register Test User registered", async () => {
  //render is used to render given component
  let num = Math.floor(Math.random() * 1000001);
  const { getByTestId } = render(<Register />);
  //   const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  //create an alert mock (mock is fake or simulated version of something like browser alert, router, etc.)
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const usernameInput = getByTestId("username");
  const confirmPasswordInput = getByTestId("confirmPassword");
  const confirmPassword = "hellloo111111";
  const email = "newTesting" + num + "@gmail.com";
  const password = "hellloo111111";
  const username = "newTestUser" + num;
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: confirmPassword },
  });
  const submit = getByTestId("submit-button");
  await fireEvent.click(submit);
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
  expect(usernameInput).toHaveValue(username);
  expect(confirmPasswordInput).toHaveValue(confirmPassword);
  expect(fetchMock).toHaveBeenCalledWith(
    "https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register",
    expect.any(Object)
  );
});
