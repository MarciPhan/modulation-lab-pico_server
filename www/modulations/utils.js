export const utils = {
    lfsr: (n, taps, length, returnState = false) => {
        let state = 0x1;
        const seq = [];
        const mask = (1 << n) - 1;
        for (let i = 0; i < length; i++) {
            let bit = 0;
            taps.forEach(t => { bit ^= (state >> (t - 1)) & 1; });
            seq.push(returnState ? state : (state & 1));
            state = ((state << 1) | bit) & mask;
            if (state === 0) state = 1;
        }
        return seq;
    },
    getRRC: (span, sps, rolloff) => {
        const N = span * sps;
        const h = new Float32Array(N + 1);
        const alpha = rolloff;
        for (let i = 0; i <= N; i++) {
            const t = (i - N / 2) / sps;
            if (Math.abs(t) < 1e-10) { h[i] = 1.0 - alpha + 4 * alpha / Math.PI; }
            else if (alpha !== 0 && Math.abs(Math.abs(t) - 1 / (4 * alpha)) < 1e-10) {
                h[i] = (alpha / Math.sqrt(2)) * (((1 + 2 / Math.PI) * Math.sin(Math.PI / (4 * alpha))) + ((1 - 2 / Math.PI) * Math.cos(Math.PI / (4 * alpha))));
            } else {
                const num = Math.sin(Math.PI * t * (1 - alpha)) + 4 * alpha * t * Math.cos(Math.PI * t * (1 + alpha));
                const den = Math.PI * t * (1 - Math.pow(4 * alpha * t, 2));
                h[i] = num / den;
            }
        }
        return h;
    },
    convolve: (signal, filter) => {
        const res = new Float32Array(signal.length);
        const half = Math.floor(filter.length / 2);
        for (let i = 0; i < signal.length; i++) {
            let sum = 0;
            for (let j = 0; j < filter.length; j++) {
                const idx = i - j + half;
                if (idx >= 0 && idx < signal.length) sum += signal[idx] * filter[j];
            }
            res[i] = sum;
        }
        return res;
    },
    simulateLinearGeneric: (bits, M, Rb, fc, sps, Nc, rolloff, span, type) => {
        const k = Math.max(1, Math.log2(M));
        const symbols = [];
        const sqrtM = Math.sqrt(M);

        for (let i = 0; i < Nc; i++) {
            const chunk = bits.slice(i * k, (i + 1) * k);
            const val = chunk.reduce((acc, b, idx) => acc + (b << (k - 1 - idx)), 0);
            const gray = val ^ (val >> 1);

            if (type === 'qam' && Number.isInteger(sqrtM)) {
                const k2 = k / 2;
                const bI = chunk.slice(0, k2).reduce((A, B, j) => A + (B << (k2 - 1 - j)), 0);
                const bQ = chunk.slice(k2).reduce((A, B, j) => A + (B << (k2 - 1 - j)), 0);
                const gI = bI ^ (bI >> 1); const gQ = bQ ^ (bQ >> 1);
                symbols.push({ I: 2 * gI - (sqrtM - 1), Q: 2 * gQ - (sqrtM - 1), val: gI + gQ * sqrtM });
            } else if (type === 'psk') {
                const phase = (2 * Math.PI * gray) / M + Math.PI / M;
                symbols.push({ I: Math.cos(phase), Q: Math.sin(phase), val: gray });
            } else if (type === 'fsk') {
                symbols.push({ f_idx: val, val: val });
            } else {
                symbols.push({ I: 2 * gray - (M - 1), Q: 0, val: gray });
            }
        }

        const Rs = Math.max(1, Rb / k);
        const Fs = Rs * sps;
        const Ntotal = Nc * sps;
        let bbI, bbQ;

        if (type === 'fsk') {
            bbI = new Float32Array(Ntotal); bbQ = new Float32Array(Ntotal);
            const fInst = new Float32Array(Ntotal);
            for (let i = 0; i < Nc; i++) {
                const fi = (symbols[i].f_idx - (M - 1) / 2) * Rs;
                for (let s = 0; s < sps; s++) {
                    const idx = i * sps + s;
                    bbI[idx] = Math.cos(2 * Math.PI * fi * s / Fs);
                    bbQ[idx] = Math.sin(2 * Math.PI * fi * s / Fs);
                    fInst[idx] = fc + fi;
                }
            }
            const t = new Float32Array(Ntotal).map((_, i) => i / Fs);
            const pb = new Float32Array(Ntotal).map((_, i) => bbI[i] * Math.cos(2 * Math.PI * fc * t[i]) - bbQ[i] * Math.sin(2 * Math.PI * fc * t[i]));
            return { t, bbI, bbQ, pb, fInst, bits, symbols, isVector: false };
        } else {
            const h = utils.getRRC(span, sps, rolloff);
            const scale = (type === 'ask' || type === 'qam' || type === 'psk') ? 1 / Math.sqrt(symbols.reduce((A, s) => A + s.I * s.I + s.Q * s.Q, 0) / Nc) : 1;
            const upI = new Float32Array(Ntotal); const upQ = new Float32Array(Ntotal);
            for (let i = 0; i < Nc; i++) { upI[i * sps] = symbols[i].I * scale; upQ[i * sps] = symbols[i].Q * scale; }
            bbI = utils.convolve(upI, h); bbQ = utils.convolve(upQ, h);
            const t = new Float32Array(Ntotal).map((_, i) => i / Fs);
            const pb = new Float32Array(Ntotal).map((_, i) => bbI[i] * Math.cos(2 * Math.PI * fc * t[i]) - bbQ[i] * Math.sin(2 * Math.PI * fc * t[i]));
            return { t, bbI, bbQ, pb, fInst: new Float32Array(Ntotal).fill(fc), bits, symbols, isVector: true };
        }
    }
};
