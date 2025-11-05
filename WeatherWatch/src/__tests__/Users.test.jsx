import React from 'react';
import { render } from '@testing-library/react';

import Users from '../Users.jsx';

test('shows error if both email and password are empty', () => {
    render(<Users />);
    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
});

test('shows error if only email is filled', () => {
    render(<Users />);
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
        target: { value: 'testing@example.com' }
    });
    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
});