// UI Mapping Base Config
export const controls = {
    mod: 'mod-type',
    mRange: 'm-order', mNum: 'm-in',
    fcRange: 'fc', fcNum: 'fc-in',
    rbRange: 'rb', rbNum: 'rb-in',
    rollRange: 'rolloff', rollNum: 'rolloff-in',
    sfRange: 'sf', sfNum: 'sf-in',
    bwRange: 'bw', bwNum: 'bw-in',
    lRange: 'l-chips', lNum: 'l-in',
    slotsRange: 'th-slots', slotsNum: 'slots-in',
    rhRange: 'rh', rhNum: 'rh-in',
    spsRange: 'sps', spsNum: 'sps-in',
    ncRange: 'nc', ncNum: 'nc-in',
    randomCheck: 'random-data',
    regenBtn: 'regen-data',
    themeBtn: 'theme-toggle',
    presBtn: 'pres-toggle',
    menuBtn: 'menu-toggle',
    helpBtn: 'show-help-btn',
    langToggle: 'lang-toggle'
};

export const elements = {};
Object.keys(controls).forEach(key => elements[key] = document.getElementById(controls[key]));

export const helpPanel = document.getElementById('help-panel');
export const infoSlots = [1, 2, 3, 4, 5].map(i => document.getElementById(`info-${i}`));
export const appContainer = document.getElementById('app');
export const welcomeModal = document.getElementById('welcome-modal');
export const closeModalBtn = document.getElementById('close-modal-btn');
export const overlay = document.getElementById('focus-overlay');
export const closeBtn = document.getElementById('focus-close');
export const focusContainer = document.getElementById('focus-plot-container');
