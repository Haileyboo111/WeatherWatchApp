import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TripPlanner from "../TripPlanner";
import { vi } from "vitest";
import * as AuthModule from "../context/AuthContext";
import * as OpenWeatherAPI from "../api/openweather";

vi.spyOn(AuthModule, "useAuth").mockReturnValue({
    user: null,
    login: vi.fn(),
    logout:vi.fn()
});

vi.spyOn(OpenWeatherAPI, "getAlerts").mockResolvedValue([
    { event: "Severe Weather", description: "Storm incoming" }
]);

test("renders TripPlanner heading and lets user type destination", () => {
    render(<TripPlanner />);

    expect(screen.getByText(/Trip Planner/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/e\.g\., Paris, France/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Paris" } });
    expect(input.value).toBe("Paris");
});
