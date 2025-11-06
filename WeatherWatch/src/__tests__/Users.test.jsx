import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Users from '../Users.jsx';

test('shows error if both email and password are empty', () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
});

test('shows error if only email is filled', () => {
    render(<Users />);
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
        target: { value: 'testing@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
});

test('shows error if only password is filled', () => {
    render(<Users />);
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
        target: { value: 'password1' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
});