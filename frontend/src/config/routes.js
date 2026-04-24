/**
 * Route Configuration
 * 
 * This file centralizes all route definitions and related configurations.
 * Easy to maintain and extend as the app grows.
 * 
 * When modifying routes:
 * 1. Update the routes array below
 * 2. If adding a new auth page, add to AUTH_PAGES
 * 3. If adding a new main page, add to MAIN_PAGES
 */

// Authentication-related pages that show minimal navigation (only brand + login/signup)
export const AUTH_PAGES = ['/login', '/signup']

// Main application pages (visible after login)
export const MAIN_PAGES = ['/', '/movies', '/movie']

// Routes configuration
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    MOVIES: '/movies/:slug',
    MOVIE: '/movie',
}

/**
 * Check if a pathname is an authentication page
 * @param {string} pathname - The current pathname
 * @returns {boolean}
 */
export const isAuthPage = (pathname) => {
    return AUTH_PAGES.some(page => pathname === page)
}

/**
 * Get the appropriate page title based on the route
 * @param {string} pathname - The current pathname
 * @returns {string}
 */
export const getPageTitle = (pathname) => {
    if (pathname === '/login') return 'Log In'
    if (pathname === '/signup') return 'Sign Up'
    if (pathname.startsWith('/movies')) return 'Movies'
    if (pathname === '/') return 'Home'
    return 'NoCapybara'
}

/**
 * Backend API endpoints (update with your actual backend URL)
 * These should be environment variables in production
 */
export const API_ENDPOINTS = {
    BASE_URL: import.meta.env.VITE_API_URL || '',
    AUTH: {
        LOGIN: '/api/auth/login',
        SIGNUP: '/api/auth/signup',
        LOGOUT: '/api/auth/logout',
        CHECK_AUTH: '/api/auth/check',
    },
    MOVIES: {
        GET_ALL: '/api/movies',
        GET_BY_SLUG: '/api/movies/:slug',
        SEARCH: '/api/movies/search',
    },
    REVIEWS: {
        GET_MOVIE_REVIEWS: '/api/reviews/movie/:movieId',
        POST_REVIEW: '/api/reviews',
    },
}
