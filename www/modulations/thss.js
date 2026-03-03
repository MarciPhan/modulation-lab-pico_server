import { utils } from './utils.js';

export default {
    id: 'thss',
    name: 'THSS (Time Hopping)',
    params: ['FC', 'RB', 'SLOTS'],
    requiredBits: (engine) => 40,
    help: 'modm_thss_desc',
    info2: 'chart_2_thss',
    info3: 'chart_3_thss',
    info4: 'chart_4_thss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_th = bits.length;
        const Np = 4; // rámců na bit (jako v referenční verzi)
        const N_frames = Nc_th * Np;

        // LFSR PN sekvence pro TH kód
        const pn = utils.lfsr(7, [7, 1], N_frames, true);
        // Kumulativní mod pro slot indexy (jako v referenci: cumsum(pn) % N_th)
        const th_code = new Array(N_frames);
        let cumsum = 0;
        for (let i = 0; i < N_frames; i++) {
            cumsum += pn[i] & 1;
            th_code[i] = cumsum % engine.SLOTS;
        }

        const sps_slot = 64;
        const Ns_slot = sps_slot;
        const Ns_frame = Ns_slot * engine.SLOTS;
        const Ns_bit = Ns_frame * Np;
        const Ntotal = Ns_bit * Nc_th;

        const Tf = 1.0 / (engine.Rb * Np); // délka rámce
        const Tc = Tf / engine.SLOTS;       // šířka slotu
        const Fs = sps_slot / Tc;

        // Parametry pulzu (monocycle)
        const pulse_width = 0.18 * Tc;
        const sigma = pulse_width / 2.8;
        const K = 5;

        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);

        // Naplnění časové osy
        for (let i = 0; i < Ntotal; i++) {
            t[i] = i / Fs;
        }

        // Syntéza basebandu s monocycle pulzy
        for (let b_idx = 0; b_idx < Nc_th; b_idx++) {
            const bit = bits[b_idx];
            const data = 2 * bit - 1;
            for (let j = 0; j < Np; j++) {
                const frame_idx = b_idx * Np + j;
                const t_frame_start = frame_idx * Ns_frame;
                const c_j = th_code[frame_idx];
                const pulse_center = t_frame_start + c_j * Ns_slot + Math.floor(Ns_slot / 2);
                const half_span = Math.floor(K * sigma * Fs);

                const i_start = Math.max(0, pulse_center - half_span);
                const i_end = Math.min(Ntotal, pulse_center + half_span + 1);

                for (let idx = i_start; idx < i_end; idx++) {
                    const tt = (idx - pulse_center) / Fs;
                    // Monocycle (1. derivace Gaussova pulzu)
                    const p = -(tt / (sigma * sigma)) * Math.exp(-(tt * tt) / (2 * sigma * sigma));
                    bbI[idx] += data * p;
                }
            }
        }

        // Pásmový signál
        for (let i = 0; i < Ntotal; i++) {
            pb[i] = bbI[i] * Math.cos(2 * Math.PI * engine.fc * t[i]);
        }

        // Data pro graf 2: TH kód (prvních 40 rámců)
        const nh_show = Math.min(40, N_frames);
        const plot2_x = Array.from({ length: nh_show }, (_, i) => i);
        const plot2_y = th_code.slice(0, nh_show);

        // Data pro graf 4: detail 1 bitu
        const detail_start = 0;
        const detail_end = Math.min(Ns_bit, Ntotal);
        const detail_t = Array.from(t.slice(detail_start, detail_end));
        const detail_bb = Array.from(bbI.slice(detail_start, detail_end));
        // Posunout čas na začátek bitu
        const t0 = detail_t[0] || 0;
        for (let i = 0; i < detail_t.length; i++) detail_t[i] -= t0;

        return {
            t, bbI, bbQ, pb, fInst, bits,
            symbols: bits.map(b => ({ val: b })),
            extras: {
                plot2_x, plot2_y,
                detail_t, detail_bb
            },
            plot2Type: 'markers'
        };
    }
};
