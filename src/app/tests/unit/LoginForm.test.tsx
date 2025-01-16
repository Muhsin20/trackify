/* eslint-disable no-unused-vars */

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Card from "@/app/components/Card";
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
    Promise.resolve(JSON.stringify({ message: "Login successful!" }))
  );
});

afterEach(() => {
  (window.alert as jest.Mock).mockRestore(); // Restore `alert` after each test
});

//it hold name of test and function holding test
it("Successful Login Test", () => {
  //render is used to render given component
  const { getByTestId } = render(
    <Card
      title="Hello!"
      title2="Welcome Back!"
      subtitle="Sign into your account"
    />
  );
  //use mock credentials to sign in
  const email = "newTesting@gmail.com";
  const password = "newTesting1234!";
  const emailInput = getByTestId("email");

  //change the form fields to have these values
  fireEvent.change(emailInput, { target: { value: email } });
  const passwordInput = getByTestId("password");
  fireEvent.change(passwordInput, { target: { value: password } });

  //submit the form
  const submit = getByTestId("submit-button");
  fireEvent.click(submit);

  //expect is condition to make the test pass
  //expect that api was called and email and password had these inputs
  expect(fetchMock).toHaveBeenCalledWith("/api/login", expect.any(Object));
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue(password);
});

//test to test empty form with api not being called and alert showing up on page
it("Empty fields", () => {
  //render is used to render given component
  const { getByTestId } = render(
    <Card
      title="Hello!"
      title2="Welcome Back!"
      subtitle="Sign into your account"
    />
  );

  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  fireEvent.change(emailInput, { target: { value: "" } });
  fireEvent.change(passwordInput, { target: { value: "" } });
  const submit = getByTestId("submit-button");
  fireEvent.click(submit);
  expect(emailInput).toHaveValue("");
  expect(passwordInput).toHaveValue("");
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith("One of the fields is empty");
});

it("Empty Email Field", () => {
  const { getByTestId } = render(
    <Card
      title="Hello!"
      title2="Welcome Back!"
      subtitle="Sign into your account"
    />
  );
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const password = "hello1112222";
  fireEvent.change(emailInput, { target: { value: "" } });
  fireEvent.change(passwordInput, { target: { value: password } });
  const submit = getByTestId("submit-button");
  fireEvent.click(submit);
  expect(window.alert).toHaveBeenCalledWith("One of the fields is empty");
  expect(emailInput).toHaveValue("");
  expect(passwordInput).toHaveValue(password);
  expect(fetchMock).not.toHaveBeenCalled();
});

it("Empty Password Field", () => {
  const { getByTestId } = render(
    <Card
      title="Hello!"
      title2="Welcome Back!"
      subtitle="Sign into your account"
    />
  );
  const emailInput = getByTestId("email");
  const passwordInput = getByTestId("password");
  const email = "testEmail@gmail.com";
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: "" } });
  const submit = getByTestId("submit-button");
  fireEvent.click(submit);
  expect(window.alert).toHaveBeenCalledWith("One of the fields is empty");
  expect(emailInput).toHaveValue(email);
  expect(passwordInput).toHaveValue("");
  expect(fetchMock).not.toHaveBeenCalled();
});
