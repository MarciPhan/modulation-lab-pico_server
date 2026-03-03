import { utils } from './utils.js';

export default {
    id: 'dsss',
    name: 'DSSS (Direct Sequence)',
    params: ['FC', 'RB', 'L'],
    requiredBits: (engine) => 10,
    help: 'modm_dsss_desc',
    info2: 'chart_2_dsss',
    info3: 'chart_3_dsss',
    info4: 'chart_4_dsss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_ds = bits.length;
        // PN sekvence (LFSR m=7, polynom x^7+x+1) – vrací bity 0/1
        const pn_bits = utils.lfsr(7, [7, 1], Nc_ds * engine.L);
        // Převod na ±1
        const pn_chips = pn_bits.map(b => 2 * b - 1);

        // Data NRZ: 0->-1, 1->+1, roztažené na čipy
        const data_expanded = [];
        bits.forEach(b => {
            const val = 2 * b - 1;
            for (let i = 0; i < engine.L; i++) data_expanded.push(val);
        });

        // Rozprostření: data × PN
        const spread_chips = data_expanded.map((d, i) => d * pn_chips[i]);

        const sps_chip = 16; // vzorků na čip (jako v referenci)
        const Rc = engine.L * engine.Rb; // čipová rychlost
        const Fs_ds = sps_chip * Rc;
        const Ntotal = spread_chips.length * sps_chip;

        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);

        // Oversampling – obdélníkový držák na čip
        for (let i = 0; i < spread_chips.length; i++) {
            for (let s = 0; s < sps_chip; s++) {
                const idx = i * sps_chip + s;
                t[idx] = idx / Fs_ds;
                bbI[idx] = spread_chips[i];
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx]);
            }
        }

        // Data pro graf 2: PN čipy ±1 (prvních 128)
        const nc = Math.min(128, pn_chips.length);
        const plot2_x = Array.from({ length: nc }, (_, i) => i);
        const plot2_y = pn_chips.slice(0, nc);

        // Data pro graf 4: detail ~3 bitů basebandu
        const chips_3bits = Math.min(3 * engine.L, spread_chips.length);
        const samp_3bits = chips_3bits * sps_chip;
        const detail_t = Array.from(t.slice(0, samp_3bits));
        const detail_bb = Array.from(bbI.slice(0, samp_3bits));

        return {
            t, bbI, bbQ, pb, fInst, bits,
            symbols: bits.map(b => ({ val: b })),
            extras: {
                plot2_x, plot2_y,
                detail_t, detail_bb
            },
            plot2Type: 'markers+lines'
        };
    }
};
