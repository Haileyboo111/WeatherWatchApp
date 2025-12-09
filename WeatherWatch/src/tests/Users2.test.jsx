import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Users from '../Users';
import { loginUser } from '../api/login_api';
import { MemoryRouter } from 'react-router-dom';

// mock loginUser so we don't make real API calls
vi.mock('../api/login_api', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
}));

// mock useAuth so we can track login calls
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ login: mockLogin }), // override useAuth hook
}));

// mock navigate so we can track redirects
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate, // override useNavigate
    };
});

// tests for users component
describe('Users component login', () => {
    // clear mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
  });



  // TEST 1 - successful login test
  test('successful login calls login with returned user', async () => {

    // mock successful login response
    loginUser.mockResolvedValue({ user: { id: 1, name: 'Test User', email: 'test@example.com' } });

    // render Users component inside MemoryRouter for routing context
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );
     // simulate user filling out email and password fields and submitting form
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // wait for login and navigation to be called
    await waitFor(() => {
        // verify login was called with correct data
        expect(mockLogin).toHaveBeenCalledWith({ id: 1, name: 'Test User', email: 'test@example.com' });
    });
  });



  // TEST 2 - failed login test
  test('failed login shows error message', async () => {

    // mock failed login response
    loginUser.mockRejectedValue('Invalid email or password');

    // render Users component inside MemoryRouter for routing context
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );
    
    // fill out and submit login form with wrong credentials
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
