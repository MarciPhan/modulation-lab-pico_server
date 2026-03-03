import { utils } from './utils.js';

export default {
    id: 'qam',
    name: 'M-QAM (Quadrature)',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_qam_desc',
    info2: 'chart_2_qam',
    info3: 'chart_3_qam',
    info4: 'chart_4_qam',
    showConstellation: true,
    simulate: (engine, bits) => {
        const res = utils.simulateLinearGeneric(bits, engine.M, engine.Rb, engine.fc, engine.sps, engine.Nc, engine.rolloff, engine.span, 'qam');
        return { ...res, extras: { envelope: res.bbI.map((v, i) => Math.sqrt(v * v + res.bbQ[i] * res.bbQ[i])) } };
    }
};
