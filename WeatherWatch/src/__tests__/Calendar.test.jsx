import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from '../Calendar.jsx';

// Match any month name for selecting the label element
const monthRegex = /January|February|March|April|May|June|July|August|September|October|November|December/;

describe('Calendar', () => {
it('shows the correct month/year for the given value', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />); // Oct 2024
  expect(screen.getByText(monthRegex)).toHaveTextContent('October 2024');
});

it('renders a stable 42-cell grid', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />);
  expect(screen.getAllByRole('gridcell')).toHaveLength(42);
});

it('renders weekday headers', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />);
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((w) => {
    expect(screen.getByText(w)).toBeInTheDocument();
  });
});

it('clicking a day calls onChange with the correct date', () => {
  const onChange = vi.fn();
  render(<Calendar value={new Date(2024, 9, 1)} onChange={onChange} />); // Oct 2024

  const day15 = screen.getAllByRole('gridcell').find((el) => el.textContent === '15');
  fireEvent.click(day15);

  expect(onChange).toHaveBeenCalledTimes(1);
  const picked = onChange.mock.calls[0][0];
  expect(picked.getFullYear()).toBe(2024);
  expect(picked.getMonth()).toBe(9);
  expect(picked.getDate()).toBe(15);
});
});

