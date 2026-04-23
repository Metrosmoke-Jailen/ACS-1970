import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

const AUTH_PAGES = ['/login', '/signup']

export const AppProvider = ({ children }) => {
    const location = useLocation()

    const [context, setContext] = useState({
        field: null,
        queryPlaceholder: 'Got something in mind?'
    })
    const [query, setQuery] = useState('')
    const [isSidebarToggled, setSidebarToggle] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)

    // Check current page is auth page
    const isAuthPage = AUTH_PAGES.some(page => location.pathname === page)

    useEffect(() => {
        if (location.pathname.startsWith('/movie')) {
            setContext({ field: 'Movies', queryPlaceholder: 'Search movies...' })
        } else {
            // For when looking up a specific thing in the future but not now
            setContext({ field: 'Home', queryPlaceholder: 'Got something in mind?' })
        }
    }, [location.pathname])

    // Is not rendered on home page currently
    const handleSetFieldHome = () => {
        setContext({ field: null, queryPlaceholder: 'Got something in mind?' })
    }

    const handleSetQuery = (e) => setQuery(e.target.value)

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
        isAuthPage
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}