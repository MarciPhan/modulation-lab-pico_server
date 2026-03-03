import Plotly from 'plotly.js-dist-min';

let activeFocusId = null;
let originalParent = null;
let placeholder = document.createElement('div');
placeholder.className = 'plot-placeholder chart-box';
placeholder.textContent = 'SIGNAL REDIRECTED TO FULLSCREEN...';

const focusObserver = new ResizeObserver(() => {
    if (activeFocusId) Plotly.Plots.resize(activeFocusId);
});

export function setupFullscreen(overlay, focusContainer, requestUpdate) {
    function enterFocus(plotId) {
        const plotEl = document.getElementById(plotId);
        if (!plotEl) return;
        activeFocusId = plotId;
        originalParent = plotEl.parentElement;
        placeholder.style.width = plotEl.offsetWidth + 'px';
        placeholder.style.height = plotEl.offsetHeight + 'px';
        originalParent.replaceChild(placeholder, plotEl);
        focusContainer.appendChild(plotEl);
        overlay.classList.remove('hidden');
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
        focusObserver.observe(focusContainer);
        setTimeout(() => Plotly.Plots.resize(plotId), 50);
    }

    function exitFocus() {
        if (!activeFocusId) return;
        const plotEl = document.getElementById(activeFocusId);
        focusObserver.unobserve(focusContainer);
        if (originalParent && plotEl) {
            plotEl.style.width = '';
            plotEl.style.height = '';
            originalParent.replaceChild(plotEl, placeholder);
        }
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        const exId = activeFocusId;
        activeFocusId = null;
        originalParent = null;
        setTimeout(() => {
            Plotly.relayout(exId, { width: null, height: null, autosize: true });
            window.dispatchEvent(new Event('resize'));
            requestUpdate();
        }, 50);
    }

    return { enterFocus, exitFocus };
}

export function initTooltips() {
    const tooltipDiv = document.createElement('div');
    tooltipDiv.id = 'global-tooltip';
    tooltipDiv.className = 'global-tooltip hidden';
    document.body.appendChild(tooltipDiv);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            const text = target.getAttribute('data-tooltip');
            tooltipDiv.innerHTML = text;
            tooltipDiv.classList.remove('hidden');

            const rect = target.getBoundingClientRect();
            let top = rect.top;
            let left = rect.right + 10;

            if (left + 280 > window.innerWidth) {
                left = rect.left - 290;
            }
            if (top + tooltipDiv.offsetHeight > window.innerHeight) {
                top = window.innerHeight - tooltipDiv.offsetHeight - 10;
            }

            tooltipDiv.style.top = top + 'px';
            tooltipDiv.style.left = left + 'px';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('[data-tooltip]')) {
            tooltipDiv.classList.add('hidden');
        }
    });
}
