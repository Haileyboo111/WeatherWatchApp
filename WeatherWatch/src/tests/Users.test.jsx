import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Users from "../Users";
import * as AuthModule from "../context/AuthContext";
import { vi } from "vitest";

describe("Users Component", () => {

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