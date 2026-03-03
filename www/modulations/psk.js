import { utils } from './utils.js';

export default {
    id: 'psk',
    name: 'M-PSK (Phase Shift)',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_psk_desc',
    info2: 'chart_2_psk',
    info3: 'chart_3_psk',
    info4: 'chart_4_psk',
    showConstellation: true,
    simulate: (engine, bits) => utils.simulateLinearGeneric(bits, engine.M, engine.Rb, engine.fc, engine.sps, engine.Nc, engine.rolloff, engine.span, 'psk')
};
