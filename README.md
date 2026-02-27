# Digital Modulation Lab - Pico W Server Edition

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Platform: Raspberry Pi Pico W](https://img.shields.io/badge/Platform-Pico%20W-orange.svg)]()
[![Type: MicroPython](https://img.shields.io/badge/Stack-MicroPython-yellow.svg)]()

Tato verze projektu **Digital Modulation Lab** je optimalizována pro běh přímo na mikrokontroléru **Raspberry Pi Pico W**. Slouží jako přenosný webový server, který vysílá interaktivní laboratoř přes Wi-Fi Access Point i bez připojení k internetu.

---

## Související projekty

Tento projekt existuje ve dvou variantách:
1. **[Web/Desktop Lab Edition](https://github.com/jakubmarcinka/modulation-lab)** – Plná, vysoce modulární verze s `_internal/src` strukturou pro vývoj a akademickou výuku.
2. **[Pico W Server Edition](https://github.com/jakubmarcinka/modulation-pico-server)** (tento repozitář) – Odlehčená verze, která servíruje produkční build aplikace přímo z paměti Pico W.

---

## Instalace na Pico W

1. **Firmware**: Nahrajte na Pico W přiložený firmware `pico_w_micropython.uf2` (přetažením do BOOTSEL režimu).
2. **Soubory**: Nahrajte obsah tohoto repozitáře do kořene vašeho Pico W (pomocí Thonny, `mpremote` nebo podobných nástrojů).
   - `main.py` – Výkonný skript serveru.
   - `www/` – Složka s webovými assety (produkční build).
3. **Spuštění**: Po restartu Pico vytvoří Wi-Fi síť s SSID `ModulationLab-AP`. Laboratoř je dostupná na adrese `http://192.168.4.1`.

---

## Optimalizace pro Pico W

Tato edice obsahuje několik specifických optimalizací:
- **Externí Plotly**: Knihovna Plotly je načítána z lokálního souboru `plotly-basic.min.js`, nikoliv z bundlu, což šetří RAM při nahrávání.
- **Offline Fonts**: Odstraněna závislost na Google Fonts pro provoz v izolovaných sítích.
- **Gzip support**: Server podporuje servírování `.gz` souborů pro snížení latence (volitelně).

---

## Přispívání a vývoj

Pro vývoj nových funkcí nebo úpravu DSP jádra doporučujeme použít **Web/Desktop Lab Edition**, kde je k dispozici plné vývojové prostředí (Vite). Poté stačí provést `npm run build` a přenést soubory do složky `www/`.

---

## Licence

Tento projekt je distribuován pod licencí **ISC**.

---
© 2026 Jakub Marcinka | Digital Modulation Lab Project
