import { useEffect, useState } from "react";

function ThemeToggle() {
    const [theme, setTheme] = useState('dark')
    console.log(theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <button
            className="ThemeToggle btn-secondary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >{theme === 'dark' ? 'light' : 'dark'}
        </button>
    )
}

export default ThemeToggle