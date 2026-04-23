# Navigation & Routing Guide

## Overview

The app now uses a flexible routing system that automatically handles authentication pages differently from main pages:

- **Auth Pages** (Login, Signup): Show minimal topbar with only brand + login/signup toggle
- **Main Pages** (Home, Movies): Show full topbar with search, navigation, and account info
- **Conditional Rendering**: TabNav and Footer only appear on main pages

## Key Files

- **`src/AppContext.jsx`** - Central state management (authentication, field context, queries)
- **`src/App.jsx`** - Main layout that conditionally renders TabNav and Footer
- **`src/persistent/Topbar.jsx`** - Navigation bar with conditional content
- **`src/config/routes.js`** - Route definitions and API endpoints

## How It Works

### Route Detection

The `AppContext` automatically detects when you're on an auth page:

```javascript
const AUTH_PAGES = ['/login', '/signup']
const isAuthPage = AUTH_PAGES.some(page => location.pathname === page)
```

When `isAuthPage` is `true`:
- Topbar shows minimal UI
- TabNav is hidden
- Footer is hidden

### Authentication State

The app tracks auth state with these context values:

```javascript
{
  isLoggedIn: boolean,      // Whether user is authenticated
  username: string | null,  // Current user's name
  isAuthPage: boolean,      // Whether on login/signup
}
```

## Adding New Routes

1. **Add to `src/config/routes.js`**:
   ```javascript
   // If it's an auth page:
   AUTH_PAGES.push('/forgot-password')
   
   // If it's a main page:
   MAIN_PAGES.push('/profile')
   ```

2. **Add the Route in `src/App.jsx`**:
   ```javascript
   <Route path='/profile' element={<Profile />} />
   ```

3. The conditional rendering will automatically apply!

## Connecting to Backend

### 1. Setup Environment Variables

Create `.env` in the frontend directory:
```
VITE_API_URL=http://localhost:5000
```

### 2. Create an Auth Service

Create `src/services/authService.js`:

```javascript
import { API_ENDPOINTS } from '../config/routes'

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return response.json()
  },

  async signup(name, email, password) {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    return response.json()
  },

  async checkAuth() {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.CHECK_AUTH}`)
    return response.json()
  },
}
```

### 3. Update AppContext to Check Auth on Load

In `src/AppContext.jsx`, add to the `AppProvider`:

```javascript
useEffect(() => {
  // Check authentication status when app loads
  authService.checkAuth()
    .then(data => {
      if (data.isAuthenticated) {
        setIsLoggedIn(true)
        setUsername(data.username)
      }
    })
    .catch(err => console.log('Not authenticated'))
}, [])
```

### 4. Update Login/Signup Components

Connect the form submissions to your auth service:

```javascript
const handleLogin = async (email, password) => {
  const response = await authService.login(email, password)
  if (response.success) {
    setIsLoggedIn(true)
    setUsername(response.username)
    navigate('/')
  }
}
```

### 5. Update Logout Button

In `src/persistent/Topbar.jsx`, update the logout handler:

```javascript
const handleLogout = async () => {
  await authService.logout()
  setIsLoggedIn(false)
  setUsername(null)
  navigate('/login')
}
```

## Troubleshooting

### Auth pages showing full navigation

- Check that your route path in `src/config/routes.js` exactly matches the router path in `src/App.jsx`
- The check is: `location.pathname === '/login'` (case-sensitive, no hash)

### Username not persisting on refresh

- Implement `checkAuth()` on app load (see "Update AppContext" section above)
- Store auth tokens in localStorage and validate on page load

### Need to add auth to specific pages only

- Update the `AUTH_PAGES` array in `src/config/routes.js`
- Or add route-level protection in `src/App.jsx` with a `ProtectedRoute` component

## Future Enhancements

- [ ] Add ProtectedRoute component to prevent unauthorized access
- [ ] Implement token refresh logic
- [ ] Add session timeout handling
- [ ] Create an AuthService for centralized API calls
- [ ] Add error boundary for auth failures
