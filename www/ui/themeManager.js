import { THEMES } from './themes/index.js';

class ThemeManager {
    constructor() {
        this.themes = THEMES;
        this.currentIdx = this.loadThemeIdx();
        this.applyTheme(this.themes[this.currentIdx]);
    }

    loadThemeIdx() {
        const savedId = localStorage.getItem('modulationLabThemeId');
        if (savedId) {
            const idx = this.themes.findIndex(t => t.id === savedId);
            if (idx !== -1) return idx;
        }
        return 0; // Dark by default
    }

    getCurrentTheme() {
        return this.themes[this.currentIdx];
    }

    nextTheme() {
        this.currentIdx = (this.currentIdx + 1) % this.themes.length;
        const theme = this.themes[this.currentIdx];
        localStorage.setItem('modulationLabThemeId', theme.id);
        this.applyTheme(theme);
        window.dispatchEvent(new Event('themeChanged'));
        return theme;
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const isPres = document.body.classList.contains('presentation');

        // Apply base vars
        Object.entries(theme.cssVars).forEach(([key, val]) => {
            root.style.setProperty(key, val);
        });

        // Apply presentation overrides if active
        if (isPres && theme.presCssVars) {
            Object.entries(theme.presCssVars).forEach(([key, val]) => {
                root.style.setProperty(key, val);
            });
        }

        // Toggle classes for specialized logic (e.g. scanlines)
        document.body.classList.toggle('light-theme', theme.id === 'light');
    }
}

export const themeManager = new ThemeManager();
