import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
    const location = useLocation()

    const [context, setContext] = useState({
        field: null,
        queryPlaceholder: 'Got something in mind?'
    })
    const [query, setQuery] = useState('')
    const [isSidebarToggled, setSidebarToggle] = useState(true)
    const username = 'Test-User' // Or manage this in state if needed

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

    const value = {
        context,
        setContext,
        query,
        setQuery,
        handleSetQuery,
        handleSetFieldHome,
        isSidebarToggled,
        setSidebarToggle,
        username
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}