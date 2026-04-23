import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from './config/routes'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

const AUTH_PAGES = ['/login', '/signup']
const BASE = API_ENDPOINTS.BASE_URL

export const AppProvider = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [context, setContext] = useState({
        field: null,
        queryPlaceholder: 'Got something in mind?'
    })
    const [query, setQuery] = useState('')
    const [isSidebarToggled, setSidebarToggle] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)

    const isAuthPage = AUTH_PAGES.some(page => location.pathname === page)

    // Restore session on first load
    useEffect(() => {
        fetch(`${BASE}/api/auth/check`, { credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.username) {
                    setIsLoggedIn(true)
                    setUsername(data.username)
                }
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (location.pathname.startsWith('/movie')) {
            setContext({ field: 'Movies', queryPlaceholder: 'Search movies...' })
        } else {
            setContext({ field: 'Home', queryPlaceholder: 'Got something in mind?' })
        }
    }, [location.pathname])

    const handleSetFieldHome = () => {
        setContext({ field: null, queryPlaceholder: 'Got something in mind?' })
    }

    const handleSetQuery = (e) => setQuery(e.target.value)

    const login = (userData) => {
        setIsLoggedIn(true)
        setUsername(userData.username)
        navigate('/')
    }

    const logout = async () => {
        await fetch(`${BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' })
        setIsLoggedIn(false)
        setUsername(null)
        navigate('/login')
    }

    const value = {
        context,
        setContext,
        query,
        setQuery,
        handleSetQuery,
        handleSetFieldHome,
        isSidebarToggled,
        setSidebarToggle,
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        isAuthPage,
        login,
        logout,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
