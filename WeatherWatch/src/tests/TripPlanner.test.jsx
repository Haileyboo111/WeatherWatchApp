import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripPlanner from './TripPlanner';
import { geocodeLocation, getDailyAggregation } from './api/openweather';

jest.mock('./api/openweather');

describe('TripPlanner Multi-Date Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and calendar', () => {
    render(<TripPlanner />);
    expect(screen.getByPlaceholderText(/e.g., Paris/i)).toBeInTheDocument();
    expect(screen.getByText(/Set Destination/i)).toBeInTheDocument();
    expect(screen.getByText(/Trip Planner/i)).toBeInTheDocument();
  });

  test('selects start and end date', () => {
    render(<TripPlanner />);
    const calendarDay = screen.getByText('15'); // mock example, your calendar might need queries differently
    fireEvent.click(calendarDay);
    expect(screen.getByText(/Trip:/i)).toBeInTheDocument();
    fireEvent.click(calendarDay); // second click
    expect(screen.getByText(/Trip:/i)).toBeInTheDocument();
  });

  test('swaps start/end if earlier date clicked', () => {
    render(<TripPlanner />);
    const day1 = screen.getByText('15');
    const day2 = screen.getByText('10');
    fireEvent.click(day1);
    fireEvent.click(day2);
    expect(screen.getByText(/Trip: 11/)).toBeInTheDocument(); // example format, adjust to your date display
  });

  test('sets destination and fetches weather', async () => {
    geocodeLocation.mockResolvedValue({ name: 'Paris', lat: 48.85, lon: 2.35 });
    getDailyAggregation.mockResolvedValue({ temperature: { min: 40, max: 60, morning: 42, afternoon: 50, evening: 55, night: 45 }, precipitation: 1, cloud_cover: { afternoon: 20 }, humidity: { afternoon: 50 }, wind: { max: { speed: 5, direction: 0 } } });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText(/e.g., Paris/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Set Destination/i));

    await waitFor(() => screen.getByText(/Weather for/i));
    expect(screen.getByText(/Destination: Paris/i)).toBeInTheDocument();
  });

  test('shows error for empty destination', () => {
    render(<TripPlanner />);
    fireEvent.click(screen.getByText(/Set Destination/i));
    expect(screen.getByText(/Please enter a destination/i)).toBeInTheDocument();
  });

  test('loading state appears while fetching', () => {
    getDailyAggregation.mockImplementation(() => new Promise(() => {}));
    render(<TripPlanner />);
    const day = screen.getByText('15');
    fireEvent.click(day);
    expect(screen.getByText(/Loading weather info/i)).toBeInTheDocument();
  });

  test('shows error if API fails', async () => {
    getDailyAggregation.mockRejectedValue(new Error('API Error'));
    geocodeLocation.mockResolvedValue({ name: 'Paris', lat: 48.85, lon: 2.35 });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText(/e.g., Paris/i), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Set Destination/i));

    await waitFor(() => screen.getByText(/Failed to fetch weather data/i));
    expect(screen.getByText(/Failed to fetch weather data/i)).toBeInTheDocument();
  });
});

