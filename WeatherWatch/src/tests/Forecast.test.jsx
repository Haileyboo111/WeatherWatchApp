import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Forecast from './Forecast';
import { getForecast, getDailyAggregation } from './api/openweather';

jest.mock('./api/openweather');

describe('Forecast Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field and search button', () => {
    render(<Forecast />);
    expect(screen.getByPlaceholderText(/enter a city/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Forecast/i)).toBeInTheDocument();
  });

  test('shows error when input is empty', () => {
    render(<Forecast />);
    fireEvent.click(screen.getByText(/Get Forecast/i));
    expect(screen.getByText(/Please enter a city/i)).toBeInTheDocument();
  });

  test('fetches and displays daily forecast', async () => {
    getForecast.mockResolvedValue([
      { date: '2025-11-24', temperature: { min: 40, max: 60 }, precipitation: 2, wind: { speed: 5, direction: 'N' }, humidity: 50 }
    ]);

    render(<Forecast />);
    fireEvent.change(screen.getByPlaceholderText(/enter a city/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Get Forecast/i));

    await waitFor(() => screen.getByText(/Weather for 2025-11-24/i));
    expect(screen.getByText(/Min: 40°F/i)).toBeInTheDocument();
    expect(screen.getByText(/Max: 60°F/i)).toBeInTheDocument();
  });

  test('shows loading while fetching', async () => {
    getForecast.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<Forecast />);
    fireEvent.change(screen.getByPlaceholderText(/enter a city/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Get Forecast/i));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('shows error message if API fails', async () => {
    getForecast.mockRejectedValue(new Error('API error'));
    render(<Forecast />);
    fireEvent.change(screen.getByPlaceholderText(/enter a city/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Get Forecast/i));

    await waitFor(() => screen.getByText(/Failed to fetch forecast/i));
    expect(screen.getByText(/Failed to fetch forecast/i)).toBeInTheDocument();
  });

  test('toggles between daily and weekly view', async () => {
    getForecast.mockResolvedValue([
      { date: '2025-11-24', temperature: { min: 40, max: 60 }, precipitation: 2, wind: { speed: 5, direction: 'N' }, humidity: 50 },
      { date: '2025-11-25', temperature: { min: 42, max: 62 }, precipitation: 0, wind: { speed: 4, direction: 'NE' }, humidity: 45 }
    ]);

    render(<Forecast />);
    fireEvent.change(screen.getByPlaceholderText(/enter a city/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Get Forecast/i));

    await waitFor(() => screen.getByText(/Weather for 2025-11-24/i));

    // assume toggle button exists
    const toggleButton = screen.getByText(/Weekly/i);
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Aggregated/i)).toBeInTheDocument(); // example check for weekly view
  });
});



