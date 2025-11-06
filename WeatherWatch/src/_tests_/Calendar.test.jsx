import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Calendar from '../Calendar.jsx';

const monthRegex = /January|February|March|April|May|June|July|August|September|October|November|December/;

test('shows the correct date for the given value', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />); // Oct 2024
  expect(screen.getByText(monthRegex)).toHaveTextContent('October 2024');
});

test('renders a stable 42-cell grid', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />);
  expect(screen.getAllByRole('gridcell')).toHaveLength(42);
});

test('renders weekday headers', () => {
  render(<Calendar value={new Date(2024, 9, 15)} onChange={() => {}} />);
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((w) => {
    expect(screen.getByText(w)).toBeInTheDocument();
  });
});

test('clicking a day calls onChange with the correct date', () => {
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
