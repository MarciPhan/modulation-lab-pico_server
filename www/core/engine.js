import { MODULATIONS } from '../modulations/index.js';

/**
 * DSP library for Live Modulation Lab v3.0 (Modular Edition)
 * Jádro starající se pouze o správu stavu, držení dat a spouštění aktivního modulu.
 */

export class ModulationEngine {
    constructor() {
        // Zde inicializujeme všechny výchozí hodnoty podle UI_PARAMS, aby nedošlo k pádům během startu
        this.M = 64;
        this.Rb = 10000;
        this.rolloff = 0.35;
        this.fc = 50000;
        this.sps = 32;
        this.span = 8;
        this.Nc = 30; // symbols

        this.L = 31; // DSSS chips
        this.SF = 8; // CSS Spreading Factor
        this.BW = 125000; // CSS/FHSS Bandwidth
        this.Rh = 1000; // FHSS Hop rate
        this.SLOTS = 8; // THSS Slots

        // Persistent data state
        this.cachedBits = null;
        this.cachedModType = null;
        this.cachedNc = null;
        this.cachedM = null;

        // Načtení dostupných modulů
        this.registry = {};
        MODULATIONS.forEach(mod => {
            this.registry[mod.id] = mod;
        });
    }

    getAvailableModulations() {
        return MODULATIONS.map(mod => ({ id: mod.id, name: mod.name }));
    }

    getModulationDef(type) {
        return this.registry[type];
    }

    generateBits(n) {
        return Array.from({ length: n }, () => Math.random() > 0.5 ? 1 : 0);
    }

    simulate(type, forceNewBits = false) {
        const modDef = this.registry[type];
        if (!modDef) {
            console.error(`Modulation type ${type} not registered!`);
            return null;
        }

        // Data Management Logic
        const needsNewBits = forceNewBits || !this.cachedBits || this.cachedModType !== type || this.cachedNc !== this.Nc || this.cachedM !== this.M;

        if (needsNewBits) {
            const numBits = modDef.requiredBits(this);
            this.cachedBits = this.generateBits(numBits);
            this.cachedModType = type;
            this.cachedNc = this.Nc;
            this.cachedM = this.M;
        }

        const bits = this.cachedBits;

        // Všechna logika pro výpočet signálu byla přesunuta do modulu.
        // Tím se engine stává univerzálním.
        const result = modDef.simulate(this, bits);

        return result;
    }
}
