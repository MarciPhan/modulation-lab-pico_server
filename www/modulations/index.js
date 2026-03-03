import qam from './qam.js';
import psk from './psk.js';
import ask from './ask.js';
import fsk from './fsk.js';
import css from './css.js';
import dsss from './dsss.js';
import fhss from './fhss.js';
import thss from './thss.js';

export { UI_PARAMS } from './params.js';

export const MODULATIONS = [
    qam,
    psk,
    ask,
    fsk,
    css,
    dsss,
    fhss,
    thss
];
