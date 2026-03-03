// Plotly is expected to be loaded as a global script in index.html for Pico W compatibility
import { getTranslation } from '../i18n/index.js';
const Plotly = window.Plotly;

export function getPlotTheme(theme, isPres) {
    const { textColor, gridColor, zeroLineColor, plotBg } = theme.plotTheme;
    const finalTextColor = isPres ? (theme.id === 'light' ? '#000000' : '#ffffff') : textColor;

    return {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: isPres ? 'rgba(0,0,0,0)' : plotBg,
        font: {
            color: finalTextColor, size: isPres ? 12 : 10, family: 'JetBrains Mono, monospace',
            weight: (theme.id === 'light' || isPres) ? 'bold' : 'normal'
        },
        margin: { t: 10, r: 15, l: 45, b: 30 },
        xaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: finalTextColor, linewidth: isPres ? 2 : 1 },
        yaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: finalTextColor, linewidth: isPres ? 2 : 1 }
    };
}

export function getPlotColors(theme, isPres) {
    if (isPres && theme.presColors) {
        return { ...theme.presColors };
    }
    return { ...theme.plotColors };
}

export function renderPlot(id, plotData, layout, config) {
    if (!Plotly) {
        console.error("Plotly library not loaded!");
        return;
    }
    Plotly.react(id, plotData, Object.assign({ autosize: true }, layout), Object.assign({ responsive: true }, config));
}

export function updateInfoSlots(slots, engine) {
    slots[0].textContent = getTranslation('info_source')
        .replace('{rb}', (engine.Rb / 1000).toString())
        .replace('{t}', (1000 / engine.Rb).toFixed(3));

    slots[2].textContent = getTranslation('info_baseband')
        .replace('{sps}', engine.sps.toString())
        .replace('{fs}', (engine.Rb * engine.sps / 1000).toFixed(1));
}
