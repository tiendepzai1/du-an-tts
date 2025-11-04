import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { UserResponse } from '../services/auth.service';

export interface AuthState {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        error: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (!authService.isAuthenticated()) {
                setState({ user: null, isLoading: false, error: null });
                return;
            }

            const user = await authService.getCurrentUser();
            setState({ user, isLoading: false, error: null });
        } catch (error: any) {
            setState({
                user: null,
                isLoading: false,
                error: error.response?.data?.message || 'An error occurred'
            });
            authService.clearTokens();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await authService.login({ email, password });
            setState({ user: response.user, isLoading: false, error: null });
            navigate('/broad');
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.response?.data?.message || 'Login failed'
            }));
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await authService.register({ username, email, password });
            setState({ user: response.user, isLoading: false, error: null });
            navigate('/broad');
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed'
            }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setState({ user: null, isLoading: false, error: null });
            navigate('/login');
        }
    };

    const updateProfile = async (data: {
        username?: string;
        bio?: string;
        currentPassword?: string;
        newPassword?: string;
    }) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedUser = await authService.updateProfile(data);
            setState(prev => ({
                ...prev,
                user: updatedUser,
                isLoading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.response?.data?.message || 'Profile update failed'
            }));
            throw error;
        }
    };

    return {
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        isAuthenticated: !!state.user,
        login,
        register,
        logout,
        updateProfile
    };
};

export default useAuth;