# Digital Modulation Lab - Pico W Server Edition

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Platform: Raspberry Pi Pico W](https://img.shields.io/badge/Platform-Pico%20W-orange.svg)]()
[![Type: MicroPython](https://img.shields.io/badge/Stack-MicroPython-yellow.svg)]()

This version of the **Digital Modulation Lab** project is optimized to run directly on the **Raspberry Pi Pico W** microcontroller. It serves as a portable web server that broadcasts the interactive laboratory over a Wi-Fi Access Point, completely independent of an internet connection.

---

## Connected Projects

This project is available in two variants:
1. **[Web/Desktop Lab Edition](https://github.com/MarciPhan/modulation-lab)** – Full, highly modular version utilizing the `_internal/src` structure for development and academic teaching.
2. **[Pico W Server Edition](https://github.com/MarciPhan/modulation-lab-pico_server)** (this repository) – A lightweight version that serves the production build of the application directly from the Pico W's flash memory.

---

## Installation on Pico W

1. **Firmware**: Flash the provided `pico_w_micropython.uf2` firmware onto your Pico W (by dragging and dropping it in BOOTSEL mode).
2. **Files**: Upload the contents of this repository to the root directory of your Pico W (using Thonny, `mpremote`, or similar tools).
   - `main.py` – The main server script.
   - `www/` – Folder containing the web assets (production build).
3. **Execution**: Upon restart, the Pico will create a Wi-Fi network with the SSID `ModulationLab-AP`. The laboratory is then accessible at `http://192.168.4.1`.

---

## Pico W Optimizations

This edition incorporates several specific optimizations tailored for microcontrollers:
- **External Plotly**: The Plotly library is loaded from a local file (`plotly-basic.min.js`) rather than being bundled, which significantly saves RAM during execution.
- **Offline Fonts**: Dependencies on Google Fonts have been removed to ensure seamless operation in isolated networks.
- **Gzip Support**: The server supports serving `.gz` compressed files to reduce latency (optional).

---

## Contributing and Development

If you wish to develop new features or modify the DSP engine, we strongly recommend using the **Web/Desktop Lab Edition**, which provides a full development environment (Vite). Afterwards, simply run `npm run build` and transfer the generated files into the `www/` folder of this repository.

---

## License

This project is distributed under the **ISC** License.

---
© 2026 Jakub Marcinka | Digital Modulation Lab Project
