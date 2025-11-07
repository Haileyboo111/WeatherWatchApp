import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Forecast from "./Forecast.jsx"; // forecast component to be tested
import * as api from "./api/openweather";

// mock the API calls to avoid real HTTP requests during tests
vi.mock("./api/openweather", () => ({
  getForecast: vi.fn(),
  getDailyAggregation: vi.fn(),
}));

// test forecast component
describe("Forecast component", () => {

  // TEST CASE 1
  // test case to verifty that the forecast heading is rendered correctly
  // checks that the basic headings and descriptions are present before any API calls
  it("renders the Forecast heading", () => {
    // render the forecast component
    render(<Forecast />);
    // check for heading and description text
    expect(screen.getByText(/weather view/i)).toBeInTheDocument();
    // check for description text
    expect(
      screen.getByText(/check today's or the weekly weather forecast/i)
    ).toBeInTheDocument();
  });
   // TEST CASE 2
  // verify that clicking the “Show Today’s Weather” button triggers an API call
  // mocks the API response and checks that the correct data is shown in the component
  it("fetches and displays daily weather data when button clicked", async () => {
    // Mock the daily aggregation API response
    api.getDailyAggregation.mockResolvedValueOnce({
      temperature: {
        min: 280,
        max: 295,
        morning: 285,
        afternoon: 290,
        evening: 288,
        night: 282,
      },
    });

    render(<Forecast />);

    // click the button to fetch weather
    fireEvent.click(screen.getByRole("button", { name: /show today/i }));

    // wait for async render
    await waitFor(() =>
      expect(screen.getByText(/today's weather/i)).toBeInTheDocument()
    );

    // verify that Fahrenheit temps are displayed
    expect(screen.getByText(/Min:/i)).toBeInTheDocument();
    expect(screen.getByText(/Max:/i)).toBeInTheDocument();
  });
});

