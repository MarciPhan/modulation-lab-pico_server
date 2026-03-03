export default {
    id: 'css',
    name: 'CSS (LoRa Chirp)',
    params: ['FC', 'RB', 'SF', 'BW'],
    requiredBits: (engine) => 4 * engine.SF,
    help: 'modm_css_desc',
    info2: 'chart_2_css',
    info3: 'chart_3_css',
    info4: 'chart_4_css',
    showConstellation: false,
    simulate: (engine, bits) => {
        const SF_eff = engine.SF;
        const M_css = Math.pow(2, SF_eff);
        const BW_css = engine.BW;
        const Rs_css = BW_css / M_css;
        const Ts_css = 1.0 / Rs_css;
        const OS = 8; // oversampling factor (jako reference)
        const Fs_css = OS * BW_css;
        const Ns = Math.round(Ts_css * Fs_css); // vzorků na symbol

        const Nc_c = Math.floor(bits.length / SF_eff);
        const symbols = [];
        for (let i = 0; i < Nc_c; i++) {
            const chunk = bits.slice(i * SF_eff, (i + 1) * SF_eff);
            const bin_int = chunk.reduce((A, B, j) => A + (B << (SF_eff - 1 - j)), 0);
            const gray = bin_int ^ (bin_int >> 1);
            symbols.push({ shift: gray, val: gray });
        }

        const Ntotal = Nc_c * Ns;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);

        // Base upchirp: f(tau) = -BW/2 + (BW/Ts)*tau, tau = 0..Ts
        // phase(tau) = 2π( f_start*tau + 0.5*k*tau^2 )
        const f_start = -BW_css / 2;
        const k_chirp = BW_css / Ts_css;

        // Pre-compute base chirp
        const base_re = new Float32Array(Ns);
        const base_im = new Float32Array(Ns);
        for (let s = 0; s < Ns; s++) {
            const tau = s / Fs_css;
            const phase = 2 * Math.PI * (f_start * tau + 0.5 * k_chirp * tau * tau);
            base_re[s] = Math.cos(phase);
            base_im[s] = Math.sin(phase);
        }

        // Mapování symbolu m na cirkulární posun: n_shift = m * Ns / M
        for (let i = 0; i < Nc_c; i++) {
            const m = symbols[i].shift % M_css;
            const n_shift = Math.round(m * Ns / M_css);
            for (let s = 0; s < Ns; s++) {
                const idx = i * Ns + s;
                const src = (s + Ns - n_shift) % Ns; // circular roll
                t[idx] = idx / Fs_css;
                bbI[idx] = base_re[src];
                bbQ[idx] = base_im[src];
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx])
                    - bbQ[idx] * Math.sin(2 * Math.PI * engine.fc * t[idx]);
            }
        }

        // Odhad instantánní frekvence z derivace unwrapped fáze basebandu
        // (1 symbol pro graf 4, jako v referenci)
        const fInst = new Float32Array(Ntotal);
        let prevAngle = Math.atan2(bbQ[0], bbI[0]);
        fInst[0] = 0;
        for (let i = 1; i < Ntotal; i++) {
            let angle = Math.atan2(bbQ[i], bbI[i]);
            let dph = angle - prevAngle;
            while (dph > Math.PI) dph -= 2 * Math.PI;
            while (dph < -Math.PI) dph += 2 * Math.PI;
            fInst[i] = (dph * Fs_css) / (2 * Math.PI);
            prevAngle = angle;
        }

        return {
            t, bbI, bbQ, pb, fInst, bits, symbols,
            extras: { m_indices: symbols.map(s => s.shift) },
            plot2Type: 'markers'
        };
    }
};
