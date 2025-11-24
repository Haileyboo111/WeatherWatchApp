import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Users from "../Users";
import * as AuthModule from "../context/AuthContext";
import { vi } from "vitest";

describe("Users Component - Login", () => {

    beforeEach(() => {
        vi.spyOn(AuthModule, "useAuth").mockReturnValue({
            login: vi.fn(),
            user: null,
        });
    });


    const renderWithProviders = () =>
        render(
        <MemoryRouter>
            <Users />
        </MemoryRouter>
    );

    test("renders login title", () => {
        renderWithProviders();
        expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    });

    test("shows error if email or password is empty", () => {
        renderWithProviders();
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));
        expect(screen.getByRole("alert")).toHaveTextContent(/enter both email and password/i);
    });

    test("correctly updates email and password inputs", () => {
        renderWithProviders();
        const emailInput = screen.getByPlaceholderText(/enter email/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);

        fireEvent.change(emailInput, { target: { value: "testing@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password1234" } });

        expect(emailInput.value).toBe("testing@example.com");
        expect(passwordInput.value).toBe("password1234");
    });
});

describe("Users Component - Registration", () => {

    beforeEach(() => {
        vi.spyOn(AuthModule, "useAuth").mockReturnValue({
            login: vi.fn(),
            user: null,
        });
    });


    const renderWithProviders = () =>
        render(
        <MemoryRouter>
            <Users />
        </MemoryRouter>
    );

    test("renders registration title when mode switched", () => {
        renderWithProviders();
        fireEvent.click(screen.getByText(/Register/i));
        expect(screen.getByRole("heading", { name: /Register/i })).toBeInTheDocument();
    });

    test("shows error if name, email, or password are empty", () => {
        renderWithProviders();
        fireEvent.click(screen.getByText(/Register/i));
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
        expect(screen.getByRole("alert")).toHaveTextContent(/enter name, email, and password/i);
    });

    test("correctly updates name, email, and password inputs", () => {
        renderWithProviders();
        fireEvent.click(screen.getByText(/Register/i));

        const nameInput = screen.getByPlaceholderText(/enter name/i);
        const emailInput = screen.getByPlaceholderText(/enter email/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);

        fireEvent.change(nameInput, { target: { value: "Test"}})
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "passwordTest1234" } });

        expect(nameInput.value).toBe("Test");
        expect(emailInput.value).toBe("test@example.com");
        expect(passwordInput.value).toBe("passwordTest1234");
    });
});

//More tests?
