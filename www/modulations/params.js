export const UI_PARAMS = {
    M: { id: 'm-order', numId: 'm-in', label: 'Order [M]', containerClass: 'param-std', min: 1, max: 10, step: 1, default: 6, isLogM: true },
    FC: { id: 'fc', numId: 'fc-in', label: 'Carrier [fc] kHz', min: 1, max: 5000, step: 1, default: 50 },
    RB: { id: 'rb', numId: 'rb-in', label: 'Bit Rate [Rb] kbps', min: 0.1, max: 1000, step: 0.1, default: 10 },
    ALPHA: { id: 'rolloff', numId: 'rolloff-in', label: 'Pulse α', containerClass: 'param-alpha', min: 0, max: 1, step: 0.01, default: 0.35 },
    SF: { id: 'sf', numId: 'sf-in', label: 'LoRa SF', containerClass: 'param-sf', min: 5, max: 16, step: 1, default: 8 },
    BW: { id: 'bw', numId: 'bw-in', label: 'Bandwidth [BW] kHz', containerClass: 'param-bw', min: 1, max: 1000, step: 1, default: 125 },
    L: { id: 'l-chips', numId: 'l-in', label: 'Chips [L]', containerClass: 'param-l', min: 1, max: 1023, step: 1, default: 31 },
    SLOTS: { id: 'th-slots', numId: 'slots-in', label: 'TH Slots', containerClass: 'param-slots', min: 1, max: 128, step: 1, default: 8 },
    RH: { id: 'rh', numId: 'rh-in', label: 'Hop [Rh] s⁻¹', containerClass: 'param-rh', min: 1, max: 10000, step: 10, default: 1000 }
};
