import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// API base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Types
interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    full_name?: string
    created_at: string
  }
}

interface UserProfile {
  id: string
  email: string
  full_name?: string
  google_id?: string
  created_at: string
  updated_at: string
}

// Hooks
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.token)
      // Invalidate user profile cache
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/register', userData)
      return data
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.token)
      // Invalidate user profile cache
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      // Remove token
      localStorage.removeItem('token')
      // Clear all cache
      queryClient.clear()
    },
  })
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<UserProfile> => {
      const { data } = await api.get('/auth/user')
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!localStorage.getItem('token'), // Only run if token exists
  })
}

export function useGoogleAuth() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (googleToken: string): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/google', { token: googleToken })
      return data
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.token)
      // Invalidate user profile cache
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

// Combined auth hook
export function useAuth() {
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()
  const userProfile = useUserProfile()
  const googleAuth = useGoogleAuth()

  const isAuthenticated = !!localStorage.getItem('token')
  const user = userProfile.data
  const isLoading = userProfile.isLoading || login.isPending || register.isPending
  const error = userProfile.error || login.error || register.error

  return {
    // Actions
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutateAsync,
    googleAuth: googleAuth.mutateAsync,
    
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    
    // Status
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending,
  }
}
