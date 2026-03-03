import cs from './cs.js';
import en from './en.js';

export const translations = { cs, en };

let currentLang = localStorage.getItem('modulationLabLang') || 'cs';

export function getTranslation(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return key;
}

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('modulationLabLang', lang);
        updateInterface();
    }
}

export function getCurrentLanguage() {
    return currentLang;
}

export function updateInterface() {
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = getTranslation(key);
    });

    const i18nTooltipElements = document.querySelectorAll('[data-i18n-tooltip]');
    i18nTooltipElements.forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        el.setAttribute('data-tooltip', getTranslation(key));
    });

    window.dispatchEvent(new Event('languageChanged'));
}
