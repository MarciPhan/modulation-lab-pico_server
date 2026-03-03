import { utils } from './utils.js';

export default {
    id: 'ask',
    name: 'M-ASK (Amplitude)',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_ask_desc',
    info2: 'chart_2_ask',
    info3: 'chart_3_ask',
    info4: 'chart_4_ask',
    showConstellation: true,
    simulate: (engine, bits) => {
        const res = utils.simulateLinearGeneric(bits, engine.M, engine.Rb, engine.fc, engine.sps, engine.Nc, engine.rolloff, engine.span, 'ask');
        return { ...res, extras: { envelope: res.bbI.map((v, i) => Math.sqrt(v * v + res.bbQ[i] * res.bbQ[i])) } };
    }
};
