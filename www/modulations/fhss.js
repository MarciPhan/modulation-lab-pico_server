import { utils } from './utils.js';

export default {
    id: 'fhss',
    name: 'FHSS (Freq. Hopping)',
    params: ['M', 'FC', 'RB', 'BW', 'RH'],
    requiredBits: (engine) => 100,
    help: 'modm_fhss_desc',
    info2: 'chart_2_fhss',
    info3: 'chart_3_fhss',
    info4: 'chart_4_fhss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_fh = bits.length;
        const M_fh = engine.M;
        const df = engine.BW / engine.M; // rozestup kanálů
        const Hps = Math.max(1, Math.floor(engine.Rh / engine.Rb)); // hops per bit
        const sps_hop = 16;
        const Rh = Hps * engine.Rb;
        const Fs_fh = sps_hop * Rh;

        const N_hops = Nc_fh * Hps;

        // LFSR PN sekvence -> kumulativní mod pro kanálové indexy (jako reference)
        const pn_raw = utils.lfsr(7, [7, 1], N_hops);
        const chan_idx = new Array(N_hops);
        let cumsum = 0;
        for (let i = 0; i < N_hops; i++) {
            cumsum += pn_raw[i];
            chan_idx[i] = cumsum % M_fh;
        }

        const Ntotal = N_hops * sps_hop;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal);

        // BPSK data na ±1, roztažené na hopy
        const data_bpsk = bits.map(b => 2 * b - 1);

        // Konstrukce signálu se spojitou fází
        let phase = 0;
        for (let h = 0; h < N_hops; h++) {
            const bit_idx = Math.floor(h / Hps);
            const d = data_bpsk[bit_idx];
            const chan = chan_idx[h];
            const fi = (chan - (M_fh - 1) / 2) * df; // frekvenční offset od fc

            for (let s = 0; s < sps_hop; s++) {
                const idx = h * sps_hop + s;
                t[idx] = idx / Fs_fh;
                // Spojitá fáze: integrujeme okamžitou frekvenci
                phase += 2 * Math.PI * fi / Fs_fh;
                const cos_bb = Math.cos(phase);
                const sin_bb = Math.sin(phase);
                bbI[idx] = d * cos_bb;
                bbQ[idx] = d * sin_bb;
                fInst[idx] = engine.fc + fi;
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx])
                    - bbQ[idx] * Math.sin(2 * Math.PI * engine.fc * t[idx]);
            }
        }

        // Odhad instantánní frekvence z derivace unwrapped fáze basebandu
        // (jako v referenčním Pythonu)
        const fInstEst = new Float32Array(Ntotal);
        let prevAngle = Math.atan2(bbQ[0], bbI[0]);
        fInstEst[0] = engine.fc;
        for (let i = 1; i < Ntotal; i++) {
            let angle = Math.atan2(bbQ[i], bbI[i]);
            let dph = angle - prevAngle;
            // Unwrap
            while (dph > Math.PI) dph -= 2 * Math.PI;
            while (dph < -Math.PI) dph += 2 * Math.PI;
            fInstEst[i] = engine.fc + (dph * Fs_fh) / (2 * Math.PI);
            prevAngle = angle;
        }

        // Data pro graf 2: hop kanály (prvních 60)
        const nh = Math.min(60, N_hops);
        const plot2_x = Array.from({ length: nh }, (_, i) => i);
        const plot2_y = chan_idx.slice(0, nh);

        return {
            t, bbI, bbQ, pb,
            fInst: fInstEst,
            bits,
            symbols: bits.map(b => ({ val: b })),
            extras: { plot2_x, plot2_y },
            plot2Type: 'markers+lines'
        };
    }
};
