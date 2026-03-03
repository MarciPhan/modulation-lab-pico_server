import { UI_PARAMS } from '../modulations/index.js';
import { getTranslation, setLanguage, getCurrentLanguage } from '../i18n/index.js';
import { themeManager } from './themeManager.js';

export function setupSyncInputs(elements, requestUpdate) {
    function sync(range, num, isLogM = false) {
        if (!range || !num) return;
        range.addEventListener('input', () => {
            num.value = isLogM ? Math.pow(2, range.value) : range.value;
            requestUpdate();
        });
        num.addEventListener('input', () => {
            if (isLogM) range.value = Math.log2(Math.max(2, num.value));
            else range.value = num.value;
            requestUpdate();
        });
    }

    sync(elements.mRange, elements.mNum, true);
    sync(elements.fcRange, elements.fcNum);
    sync(elements.rbRange, elements.rbNum);
    sync(elements.rollRange, elements.rollNum);
    sync(elements.sfRange, elements.sfNum);
    sync(elements.bwRange, elements.bwNum);
    sync(elements.lRange, elements.lNum);
    sync(elements.slotsRange, elements.slotsNum);
    sync(elements.rhRange, elements.rhNum);
    sync(elements.spsRange, elements.spsNum);
    sync(elements.ncRange, elements.ncNum);
}

export function setupMainEvents(elements, engine, requestUpdate, updateInterface, enterFocus, exitFocus) {
    // Presentation Mode
    elements.presBtn.addEventListener('click', () => {
        document.body.classList.toggle('presentation');
        elements.presBtn.classList.toggle('active');

        // Re-apply theme to pick up presentation overrides
        themeManager.applyTheme(themeManager.getCurrentTheme());

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            requestUpdate();
        }, 50);
    });

    elements.themeBtn.addEventListener('click', () => {
        themeManager.nextTheme();
        requestUpdate();
    });

    // Language Management
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', () => {
            const nextLang = getCurrentLanguage() === 'cs' ? 'en' : 'cs';
            setLanguage(nextLang);
        });
    }

    // Mobile Menu Toggle
    if (elements.menuBtn) {
        elements.menuBtn.addEventListener('click', (e) => {
            const sidePanel = document.querySelector('.controls');
            const isActive = sidePanel.classList.toggle('active');
            elements.menuBtn.textContent = isActive ? '✕' : '☰';
        });
    }

    document.addEventListener('click', (e) => {
        const sidePanel = document.querySelector('.controls');
        if (sidePanel && sidePanel.classList.contains('active') && !sidePanel.contains(e.target) && !elements.menuBtn.contains(e.target)) {
            sidePanel.classList.remove('active');
            elements.menuBtn.textContent = '☰';
        }
    });

    if (elements.mod) elements.mod.addEventListener('change', () => requestUpdate(true));
    if (elements.regenBtn) elements.regenBtn.addEventListener('click', () => requestUpdate(true));

    document.querySelectorAll('.focus-btn').forEach(btn => {
        btn.onclick = () => enterFocus(btn.dataset.plot);
    });
}
