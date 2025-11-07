import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Forecast from "../Forecast";
import * as api from "../api/openweather";

// Mock the OpenWeather API functions
jest.mock("../api/openweather");

const mockDailyData = {
  temperature: {
    min: 280,
    max: 295,
    morning: 283,
    afternoon: 289,
    evening: 285,
    night: 281,
  },
  precipitation: { total: 1 },
  cloud_cover: { afternoon: 40 },
  humidity: { afternoon: 55 },
  wind: { max: { speed: 3, direction: 120 } },
};

const mockWeeklyData = {
  daily: [
    { dt: 1731196800, temp: { min: 10, max: 18 }, weather: [{ main: "Clouds" }] },
    { dt: 1731283200, temp: { min: 12, max: 19 }, weather: [{ main: "Clear" }] },
  ],
};

describe("Forecast Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Forecast header and buttons", () => {
    render(<Forecast />);
    expect(screen.getByText(/Forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekly/i)).toBeInTheDocument();
  });

  test("loads daily forecast when Daily is selected", async () => {
    api.getDailyAggregation.mockResolvedValueOnce(mockDailyData);

    render(<Forecast />);

    // click the Daily button
    fireEvent.click(screen.getByText(/Daily/i));

    await waitFor(() => {
      expect(screen.getByText(/Temperature:/i)).toBeInTheDocument();
    });
  });

  test("loads weekly forecast when Weekly is selected", async () => {
    api.getForecast.mockResolvedValueOnce(mockWeeklyData);

    render(<Forecast />);

    // click the Weekly button
    fireEvent.click(screen.getByText(/Weekly/i));

    await waitFor(() => {
      expect(screen.getByText(/7-Day Forecast/i)).toBeInTheDocument();
    });
  });
});

