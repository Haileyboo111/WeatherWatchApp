import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripPlanner from '../TripPlanner';
import { geocodeLocation, getDailyAggregation } from '../api/openweather';

vi.mock('../api/openweather', () => ({
  geocodeLocation: vi.fn(),
  getDailyAggregation: vi.fn(),
}));

const destination = { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 };

const mockDailyAggregation = {
  temperature: {
    min: 280,
    max: 290,
    morning: 281,
    afternoon: 285,
    evening: 283,
    night: 279,
  },
  precipitation: { total: 5 },
  cloud_cover: { afternoon: 60 },
  humidity: { afternoon: 55 },
  wind: { max: { speed: 8, direction: 315 } },
};

describe('TripPlanner destination lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('geocodes the destination and shows the selected place pill', async () => {
    geocodeLocation.mockResolvedValue(destination);
    const user = userEvent.setup();

    render(<TripPlanner />);

    await user.type(screen.getByLabelText(/where to/i), 'Paris');
    await user.click(screen.getByRole('button', { name: /set destination/i }));

    await waitFor(() => expect(geocodeLocation).toHaveBeenCalledWith('Paris'));
    expect(await screen.findByText(/Selected: Paris, FR/)).toBeInTheDocument();
    expect(getDailyAggregation).not.toHaveBeenCalled();
  });

  it('fetches and renders forecast data after selecting a date', async () => {
    geocodeLocation.mockResolvedValue(destination);
    getDailyAggregation.mockResolvedValue(mockDailyAggregation);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const fixedDate = new Date(2024, 5, 15);
    vi.setSystemTime(fixedDate);

    const user = userEvent.setup();

    render(<TripPlanner />);

    await user.type(screen.getByLabelText(/where to/i), 'Paris');
    await user.click(screen.getByRole('button', { name: /set destination/i }));
    await screen.findByText(/Selected: Paris, FR/);

    const dayButton = screen.getByRole('gridcell', { name: 'Sat Jun 15 2024' });
    await user.click(dayButton);

    await waitFor(() =>
      expect(getDailyAggregation).toHaveBeenCalledWith(48.8566, 2.3522, '2024-06-15')
    );

    expect(await screen.findByText(/Precipitation: 5 mm/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind: 8 m\/s NW/i)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 55%/i)).toBeInTheDocument();
  });
});
