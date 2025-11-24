import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Users from './Users';
import { useAuth } from './context/AuthContext';
import { loginUser } from './api/login_api';
import { MemoryRouter } from 'react-router-dom';

// mock loginUser so i dont make real API calls
jest.mock('./api/login_api', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
}));

// mock useAuth so i can track login calls
const mockLogin = jest.fn();
jest.mock('./context/AuthContext', () => ({
    useAuth: () => ({ login: mockLogin }), // override useAuth hook
}));

// mock navigate so i can track redirects
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate, // override useNavigate
}));

// tests for users component
describe('Users component login', () => {
    // clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
  });



  // TEST 1 - successful login test
  test('successful login redirects to /trip-planner', async () => {

    // mock successful login response
    loginUser.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });

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
        // verify navigation to trip-planner page
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/trip-planner');
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
