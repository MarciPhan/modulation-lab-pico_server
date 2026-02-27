import { ModulationEngine } from './core/engine.js';
import { elements, helpPanel, infoSlots, welcomeModal, closeModalBtn, overlay, focusContainer, closeBtn } from './ui/dom.js';
import { getTranslation, updateInterface } from './i18n/index.js';
import { UI_PARAMS } from './modulations/index.js';
import { getPlotTheme, getPlotColors, renderPlot, updateInfoSlots } from './ui/charts.js';
import { setupFullscreen, initTooltips } from './ui/utils.js';
import { setupSyncInputs, setupMainEvents } from './ui/events.js';

/**
 * Modulation Lab 3.0 - Modular Presentation Engine (SRC Edition)
 */

const engine = new ModulationEngine();

// Inicializace dynamického seznamu modulací
const initModulationList = () => {
    const selector = elements.mod;
    selector.innerHTML = '';
    const available = engine.getAvailableModulations();
    available.forEach(mod => {
        const option = document.createElement('option');
        option.value = mod.id;
        option.textContent = mod.name;
        selector.appendChild(option);
    });
};

// Render Orchestrator
let renderPending = false;
let needsForcedRegen = false;

function requestUpdate(forceRegen = false) {
    if (forceRegen) needsForcedRegen = true;
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
        runSimulation(needsForcedRegen || elements.randomCheck.checked);
        needsForcedRegen = false;
        renderPending = false;
    });
}

function updateGUIByModule(modDef) {
    const allClasses = Object.values(UI_PARAMS).map(v => v.containerClass).filter(Boolean);
    const requiredClasses = modDef.params.map(pKey => UI_PARAMS[pKey].containerClass).filter(Boolean);

    allClasses.forEach(cls => {
        const el = document.querySelector(`.` + cls);
        if (el) el.style.display = requiredClasses.includes(cls) ? 'flex' : 'none';
    });

    if (helpPanel) helpPanel.innerHTML = getTranslation(modDef.help);

    const t2 = document.getElementById('title-2-text');
    if (t2) t2.textContent = getTranslation(modDef.info2 || 'chart_2_sym_mapping');

    const t3 = document.getElementById('title-3-text');
    if (t3) t3.textContent = getTranslation(modDef.info3 || 'chart_3_baseband');

    const t4 = document.getElementById('title-4-text');
    if (t4) t4.textContent = getTranslation(modDef.info4 || 'chart_4_tech_vector');

    const constBtn = document.querySelector('.focus-btn[data-plot="plot-const"]');
    if (constBtn) constBtn.style.display = modDef.showConstellation ? 'inline-block' : 'none';
}

function runSimulation(forceRegen = false) {
    const type = elements.mod.value;
    const modDef = engine.getModulationDef(type);
    if (!modDef) return;

    const isLight = document.body.classList.contains('light-theme');
    const isPres = document.body.classList.contains('presentation');

    const theme = getPlotTheme(isLight, isPres);
    const colors = getPlotColors(isLight, isPres);
    const { trace1, trace2, trace3, trace4 } = colors;

    updateGUIByModule(modDef);

    // Sync Engine Params
    engine.M = parseInt(elements.mNum.value) || 2;
    engine.fc = parseFloat(elements.fcNum.value) * 1000;
    engine.Rb = Math.max(0.1, parseFloat(elements.rbNum.value)) * 1000;
    engine.rolloff = parseFloat(elements.rollNum.value);
    engine.SF = parseInt(elements.sfNum.value);
    engine.BW = parseFloat(elements.bwNum.value) * 1000;
    engine.L = parseInt(elements.lNum.value);
    engine.N_th = parseInt(elements.slotsNum.value);
    engine.Rh = parseFloat(elements.rhNum.value);
    engine.sps = parseInt(elements.spsNum.value);
    engine.Nc = parseInt(elements.ncNum.value);

    updateInfoSlots(infoSlots, engine);

    const data = engine.simulate(type, forceRegen);
    if (!data) return;

    const sliceView = 3000;
    const lineWidth = isPres ? 3 : 2;

    // Plot 1: Source
    renderPlot('plot-1', [{
        x: Array.from({ length: data.bits.length }, (_, i) => i), y: data.bits,
        mode: 'lines', line: { shape: 'hv', color: trace1, width: lineWidth },
        fill: 'tozeroy', fillcolor: isLight ? 'rgba(0, 90, 158, 0.15)' : 'rgba(139, 233, 253, 0.08)'
    }], { ...theme, yaxis: { range: [-0.2, 1.2], dtick: 1, gridcolor: theme.xaxis.gridcolor, zerolinecolor: theme.xaxis.zerolinecolor } }, { displayModeBar: false });

    // Plot 2: Mapping
    let p2Data = [];
    if (data.plot2Type) {
        p2Data = [{ x: data.extras.plot2_x, y: data.extras.plot2_y, mode: data.plot2Type, line: { width: lineWidth - 0.5, color: trace2 }, marker: { color: trace2, size: isPres ? 8 : 6 } }];
    } else {
        p2Data = [{ x: Array.from({ length: data.symbols.length }, (_, i) => i), y: data.symbols.map(s => s.val), mode: 'markers', marker: { color: trace2, size: isPres ? 8 : 6 }, error_y: { type: 'data', array: data.symbols.map(s => 0), arrayminus: data.symbols.map(s => s.val), color: trace2, width: lineWidth - 1 } }];
    }
    renderPlot('plot-2', p2Data, { ...theme }, { displayModeBar: false });

    // Plot 3: Baseband
    renderPlot('plot-3', [
        { x: data.t.slice(0, sliceView), y: data.bbI.slice(0, sliceView), name: 'I', line: { color: trace3, width: lineWidth } },
        { x: data.t.slice(0, sliceView), y: data.bbQ.slice(0, sliceView), name: 'Q', line: { color: trace2, width: lineWidth } }
    ], { ...theme }, { displayModeBar: false });

    // Plot 4 Analysis
    let p4Data = [];
    if (modDef.isVector || data.isVector) {
        if (data.extras && data.extras.envelope) {
            p4Data = [{ x: data.t.slice(0, sliceView), y: data.extras.envelope.slice(0, sliceView), line: { color: trace4, width: lineWidth } }];
        } else {
            const phase = data.bbI.slice(0, sliceView).map((v, i) => Math.atan2(data.bbQ[i], v));
            p4Data = [{ x: data.t.slice(0, sliceView), y: phase, line: { color: trace4, width: lineWidth - 0.5 } }];
        }
    } else {
        p4Data = [{ x: data.t.slice(0, sliceView), y: data.fInst.slice(0, sliceView).map(f => f / 1000), line: { color: trace4, width: lineWidth } }];
    }
    renderPlot('plot-4', p4Data, { ...theme }, { displayModeBar: false });

    // Constellation
    if (modDef.showConstellation) {
        let constLayout = { ...theme, margin: { t: 10, r: 10, l: 35, b: 35 }, xaxis: { range: [-2, 2], dtick: 1, linewidth: 2, linecolor: theme.xaxis.linecolor }, yaxis: { range: [-2, 2], scaleanchor: 'x', dtick: 1, linewidth: 2, linecolor: theme.yaxis.linecolor } };
        let constData = (data.symbols[0] && data.symbols[0].I !== undefined) ? [{ x: data.symbols.map(s => s.I), y: data.symbols.map(s => s.Q), mode: 'markers', type: 'scatter', marker: { color: trace3, size: isPres ? 6 : 4 } }] : [{ x: data.bbI.slice(0, 1000), y: data.bbQ.slice(0, 1000), mode: 'lines', line: { color: trace3, width: lineWidth - 0.5 } }];
        renderPlot('plot-const', constData, constLayout, { displayModeBar: false });
    }

    // Plot 5: RF
    renderPlot('plot-5', [{ x: data.t.slice(0, 5000), y: data.pb.slice(0, 5000), line: { color: trace1, width: lineWidth - 0.5 } }], { ...theme }, { displayModeBar: false });
}

// Inicializace
initModulationList();
updateInterface();
initTooltips();
const { enterFocus, exitFocus } = setupFullscreen(overlay, focusContainer, requestUpdate);
setupSyncInputs(elements, requestUpdate);
setupMainEvents(elements, engine, requestUpdate, updateInterface, enterFocus, exitFocus);

// Welcome Modal
if (!localStorage.getItem('modulationLabGuided')) {
    welcomeModal.classList.remove('hidden');
}
closeModalBtn.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
    localStorage.setItem('modulationLabGuided', 'true');
});

// Event pro změnu jazyka (překreslení GUI)
window.addEventListener('languageChanged', () => {
    const activeModId = elements.mod ? elements.mod.value : 'qam';
    const modDef = engine.getModulationDef(activeModId);
    if (modDef) updateGUIByModule(modDef);
});

if (closeBtn) closeBtn.addEventListener('click', exitFocus);

// Spustit simulaci
requestUpdate(true);
