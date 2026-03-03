export default {
    // UI Menu a Ovládací prvky
    'menu_params': 'Parametry',
    'menu_presentation': 'Prezentace & Výuka',
    'lbl_modulation': 'Modulační cesta',
    'lbl_random_data': 'Náhodná data',
    'btn_regen': 'Regen',
    'lbl_order': 'Řád [M]',
    'lbl_carrier': 'Nosná [fc] kHz',
    'lbl_bitrate': 'Bitová rychlost [Rb] kbps',
    'lbl_pulse': 'Alfa pulzu α',
    'lbl_sf': 'LoRa SF',
    'lbl_bw': 'Šířka pásma [BW]',
    'lbl_chips': 'Čipy [L]',
    'lbl_slots': 'TH Sloty',
    'lbl_hop': 'Hop [Rh]',
    'lbl_samples': 'Vzorků/Sym',
    'lbl_symbol_count': 'Počet symbolů',
    'btn_guide': 'PRŮVODCE APLIKACÍ',
    'btn_presentation': 'PRESENTATION MODE',

    // Lab Header & Status
    'header_title': 'Modulation Lab',
    'header_status': 'Status systému: SIGNAL LOCK v4.0',
    'divider_legend': 'LEGENDA / NÁPOVĚDA',
    'divider_engine': 'NASTAVENÍ ENGINU',
    'help_initial': 'Vyberte modulaci pro zobrazení detailů.',

    // Info Slot Keys
    'info_source': 'Zdroj: Rb = {rb} kbps | Bit t = {t} ms',
    'info_baseband': 'Baseband: SPS = {sps} | f_sampling = {fs} kHz',

    // Tooltipy Fyzikálních parametrů
    'tt_random_data': "Zaškrtnutím bude aplikace při každém překreslení generovat nová náhodná datová slova. Tlačítkem Regen můžete ručně vygenerovat novou zprávu a vynutit překreslení nezávisle na změnách v parametrech.",
    'tt_order': "Řád modulace. Udává celkový počet distinktních (jedinečných) stavů symbolů v konstelaci. Čím vyšší řád, tím více bitů přeneseme jedním symbolem, roste ale riziko chyb (BER).",
    'tt_carrier': "Nosná frekvence. Základní (oscilační) kmitočet sinusovky, tzv. nosné vlny. Právě do změn její fáze, amplitudy či frekvence je podle zvolené modulace ukryta samotná zpráva.",
    'tt_bitrate': "Přenosová (bitová) rychlost. Kolik jedniček a nul chrlí datový generátor za sekundu (zde v tisících - kbps). Na základě Rb a řádu M lze spočítat výslednou vzorkovací rychlost.",
    'tt_pulse': "Koeficient zakulacení (Rolloff) u RRC filtru. Tento filtr před vysíláním schválně maže obdélníkovým pulzům ostré rohy. Dělá to proto, aby vyzářený signál zbytečně nezabíral extrémní šířku frekvenčního pásma okolním zařízením.",
    'tt_sf': "Spreading Factor u LoRy. Definuje délku písknutí (chirpu) potažmo celou rychlost a délku přenášeného symbolu. Vyšší SF zásadně prodlužuje let signálu, ale drasticky pohlcuje přenosovou rychlost dat.",
    'tt_bw': "Frekvenční šířka pásma u LoRy (Chirp Spread Spectrum). Zvyšuje-li se BW, nabere hvizd širší rozestup, což zkrátí délku chirpu a urychlí přenos symobu. BW má tak vliv na kapacitu kanálu.",
    'tt_chips': "Délka PRN kódu (tzv. čipy) na jeden informační bit. Jeden pomalý a čitelný bit zprávy je nasekán ('rozprostřen') na obrovské množství kratičkých náhodných čipů, což z něj pro třetí stranu udělá rušivý šum.",
    'tt_slots': "Počet úzkých pevných časových 'oken' (slotů), do kterých se trefuje velmi krátký, leč energeticky silný pulz o ostaním čase v tichu (Pulse Position a Time Hopping rádio).",
    'tt_hop': "Rychlost přeskakování u FHSS rádio modulací. Udává, kolik přeskoků nosné frekvence provede vysílač s přijímačem za jednu sekundu, čímž unikají zarušení na jednom z kanálů.",
    'tt_samples': "Čistě matematický parametr, udávající kolik drobných bodů/vzorků vykresluje náš JavaScript simulátor pro znázornění jediné modulační vlnky. Více bodů = hladší průběh grafu, těžší na procesor prohlížeče.",
    'tt_symbol_count': "Kolik symbolů napočítáme pro celkovou velikost prováděné simulační dávky. Pokud snížíte toto číslo, odlehčíte webovému prohlížeči, jelikož signálová trasa bude krátká a rychlá na výpočet.",

    // Názvy grafů
    'chart_1_title': "1) Zdrojová data (Bity)",
    'chart_1_tt': "Náhodně vygenerovaná binární informace (1 a 0), kterou se snažíme přenést pomocí rádiových vln. Krok za krokem projdeme procesem mapování z 'počítačové' digitální podoby do elektrického napětí pro anténu.",
    'chart_2_title': "2) Mapování / Kód",
    'chart_2_tt': "Ukazuje způsob převodu několika binárních bitů do jedné logické hodnoty ('symbolu'). Namísto jedniček a nul může vzniknout složitější kód, například fázový úhel nebo šumová sekvence určující stav vlny.",
    'chart_3_title': "3) Základní pásmo",
    'chart_3_tt': "Reprezentace signálu v tzv. základním (nízkofrekvenčním) pásmu před 'posazením' na finální vysílací anténu. Pomocí matematických funkcí (I/Q složky) se tu konstrují hladké průběhy změn fáze i amplitudy skrze tvarovací filtry.",
    'chart_4_title': "4) Technická analýza / Konstelace",
    'chart_4_tt': "Analytický pohled do vlastností 'vyrobeného' signálu. Zobrazuje buď okamžitou aktuální frekvenci přenášenou v grafu níže (užitečné u LoRa či FSK), modulovou obálku (součtovou velikost energie) nebo reálné I/Q body nakreslené vedle sebe do kruhové konstelace.",
    'chart_5_title': "5) Výstup RF kanálu",
    'chart_5_tt': "Toto vlna nakonec vyletí z vaší antény a poletí rychlostí světla prostorem! Finální namodulovaná 'našponovaná' nosná Carrier frekvence obsahující skryté informace v jejích deformacích. Zářná demonstrace FM/AM/PM principů.",
    // Per-module názvy grafů (odpovídají referenčním Python skriptům)
    // QAM
    'chart_2_qam': "2) Konstelace M-QAM (Gray)",
    'chart_3_qam': "3) Základní pásmo (RRC tvarování) – I/Q",
    'chart_4_qam': "4) Obálka základního pásma |s_BB(t)|",
    // PSK
    'chart_2_psk': "2) Konstelace M-PSK (Gray)",
    'chart_3_psk': "3) Základní pásmo (RRC tvarování) – I/Q",
    'chart_4_psk': "4) Fáze signálu",
    // ASK
    'chart_2_ask': "2) Symboly (Gray) – normalizované amplitudy",
    'chart_3_ask': "3) Základní pásmo (RRC tvarování)",
    'chart_4_ask': "4) Fáze signálu",
    // FSK
    'chart_2_fsk': "2) Symboly (Gray)",
    'chart_3_fsk': "3) Základní pásmo – I/Q",
    'chart_4_fsk': "4) Okamžitá frekvence (kHz)",
    // CSS
    'chart_2_css': "2) Indexy symbolů m (Chirp)",
    'chart_3_css': "3) Základní pásmo (CSS) – I/Q",
    'chart_4_css': "4) Instantánní frekvence chirpu (kHz)",
    // DSSS
    'chart_2_dsss': "2) PN čipová sekvence (±1)",
    'chart_3_dsss': "3) Rozprostřené čipy (data × PN)",
    'chart_4_dsss': "4) Základní pásmo DSSS – I(t)",
    // FHSS
    'chart_2_fhss': "2) Index kanálu (FHSS hop)",
    'chart_3_fhss': "3) Základní pásmo – I/Q",
    'chart_4_fhss': "4) Instantánní frekvence z basebandu (kHz)",
    // THSS
    'chart_2_thss': "2) Time-hopping kód (TH sloty)",
    'chart_3_thss': "3) Základní pásmo THSS",
    'chart_4_thss': "4) Detail 1 bitu – pulzy s TH",

    // Sekce Modulu Popisů
    'modm_qam_desc': "<strong>M-QAM (Kvadraturní amplitudová modulace):</strong> Pokročilá modulační technika, která mění současně amplitudu i fázi nosné vlny. Používá se všude tam, kde potřebujeme přenést ohromné množství dat – od rychlých 5G sítí, přes moderní Wi-Fi (např. Wi-Fi 6 používá 1024-QAM) až po digitální televizi (DVB-T2). Konstelace v Grafu 2 ukazuje rozložení symbolů do dvourozměrné mřížky. Čím více bodů (vyšší řád M), tím více bitů přeneseme jedním symbolem, ale body jsou k sobě blíž a jsou proto náchylnější k chybovosti způsobené šumem v kanálu.",
    'modm_psk_desc': "<strong>M-PSK (Fázové klíčování):</strong> Modulace, při které nese informaci výhradně změna fáze (posunutí v čase) nosné sinusovky, zatímco její amplituda zůstává neměnná. Z grafu na pozici 2 (konstelační diagram) je jasně vidět, že všechny stavy symbolů leží na kružnici. Je mimořádně oblíbená v satelitních komunikacích, GPS, nebo pro spolehlivou komunikaci mobilních telefonů při špatném signálu, jelikož díky stabilní amplitudě nepotřebuje tak kvalitní a lineární zesilovače jako QAM.",
    'modm_ask_desc': "<strong>M-ASK (Amplitudové klíčování):</strong> Nejjednodušší forma digitální modulace. Informace je zakódována čistě jen do změny výšky (amplitudy) nosné vlny (fáze se u ní vůbe nemění). Pokud by M=2, jedná se de facto o obyčejnou Morseovku (zapnuto/vypnuto) zvanou OOK. Přestože je velmi náchylná k poškození od amplitudového (např. atmosférického) šumu, stále se díky své naprosté jednoduchosti používá u levných optických přenosů, starších bezdrátových zvonků a ovladačů od vrat.",
    'modm_fsk_desc': "<strong>M-FSK (Frekvenční klíčování):</strong> Namísto měnění síly signálu se k přenosu různých stavů používá přeskok mezi odlišnými frekvencemi (tóninami). Graf 4 tak místo konstelace ukazuje prudké změny okamžité frekvence. Tento způsob je velmi odolný proti rušení a útlumu (typické pro telemetrii, starší modemy, systémy v pásmu 433 MHz nebo komunikaci pagerů). I pro člověka by zněla M-FSK akusticky jako plynulé přeskakování tónů od hlubokých k vysokým.",
    'modm_css_desc': "<strong>CSS (LoRa Chirp Spread Spectrum):</strong> Patentovaná revoluční technika firmy Semtech pro bateriově napájený 'Internet věcí' (IoT). Namísto jedné frekvence signál neustále plynule přelaďuje (píská odzdola nahoru) a tvoří takzvaný 'Chirp'. Do těchto hvizdů se zakóduje zpráva časovým odsazením začátku hvizdu. Modulace dokáže signál 'uhrabat' hluboko pod hranici šumu (na displeji by bylo zdánlivě ticho) a signál tak doletí od obyčejného senzoru i desítky kilometrů daleko s extrémně malou baterií.",
    'modm_dsss_desc': "<strong>DSSS (Přímé rozprostření spektra):</strong> Původně vojenská technologie. Jeden informační bit je rozsekán na dlouhou sekvenci krátkých 'čipů' pomocí pseudonáhodného šumového kódu. Tím se signál doslova rozprostře a rozmaže do obří šířky pásma, takže pro nepřítele vypadá jen jako nezajímavý šum z vesmíru. Na přijímači se stejným tajným kódem signál znovu složí a vynoří ho nad rušičky. Tuto metodu dodnes bezpečně využívají GPS satelity k určení polohy z velmi slabých signálů na Zemi nebo starší standardy Wi-Fi.",
    'modm_fhss_desc': "<strong>FHSS (Frekvenční přeskokování):</strong> Další formát rozprostřeného spektra, koncepčně navržený herečkou Hedy Lamarrovou za 2. světové války pro bezpečné řízení torpéd. Vysílač s přijímačem rychlostí blesku synchronně střídají nosnou frekvenci podle předem dohodnutého šifrovacího klíče (kódu přeskoků). Pokud nepřítel nebo cizí přístroj ruší jednu frekvenci, poškodí se jen nepatrný zlomek sekundy, než FHSS vysílačka znovu uskočí jinam. Využívá to dnes klasické Bluetooth, které přeskakuje frekvence klidně i 1600x za vteřinu.",
    'modm_thss_desc': "<strong>THSS (Časově-přeskokové spektrum):</strong> Spočívá ve vysílání silných, avšak mimořádně kratičkých impulsů (záblesků) energie v přesně vypočítaných časových intervalech ('slotech'). Systém je z většiny času plně potichu a čeká. Výhodou je, že ohromné množství takových zařízení může sdílet absolutně stejné vysílací frekvenční pásmo najednou. Pravděpodobnost kolize jejich ultrarychlých krátkých pulzů v čase se totiž limitně blíží k nule. THSS je úzkým příbuzným formátů typických pro UWB (Ultra-Wideband). <br><br><strong>Upozornění:</strong> U THSS je vzorkování nastaveno na 200 kHz. Pokud nastavíte nosnou frekvenci fc příliš vysoko (nad 100 kHz), dojdou k tzv. aliasingu a graf 5 bude vypadat jako rovná čára. Pro tento modul doporučujeme držet fc pod 100 kHz.",
    // Modal Průvodce
    'modal_welcome_title': "Vítejte v Modulation Lab 3.0",
    'modal_welcome_intro': "Tato aplikace slouží k interaktivnímu pochopení principů fungování digitálních rádiových modulací pro studenty.",
    'modal_section_1_title': "Levé menu (Parametry Modulace)",
    'modal_section_1_body': "Nahoře můžete vybrat libovolný <strong>modulační formát</strong> (QAM, PSK, LoRa...). Pod ním naleznete všechny fyzikální parametry vysílače. <strong>Zkuste najet myší na tyrkysové symboly <span class=\"info-icon\" style=\"position:static; margin:0 2px; vertical-align: middle;\">?</span> vedle názvů</strong>, kde ihned zjistíte, co se stane, když parametr posuvníkem změníte!",
    'modal_section_2_title': "Pravá sekce (Grafické panely)",
    'modal_section_2_body': "Aplikace okamžitě krokově simuluje signál tak, jak putuje obvody k anténě: od počítačových nul a jedniček (Graf 1), přes jejich mapování (Graf 2), zpracování frekvenčními filtry do základního pásma (Graf 3), až po výslednou oscilující nosnou rádiovou vlnu putující z antény 299 792 km/s vesmírem (Graf 5).",
    'modal_section_2_footer': "U každého z grafů můžete kliknout na ikonu <strong>⛶ pro zvětšení (fullscreen)</strong> zobrazení.",
    'modal_section_3_title': "Prezentace a Výuka",
    'modal_section_3_body': "Pro promítání třídě je vlevo k dispozici <strong>PRESENTATION MODE</strong>. Aplikace ztlumí prvky na pozadí a nabere vysokokontrastní neonou paletu, která je na projektorech perfektní pro ukázku i ze vzdálenějších lavic.",
    'modal_close_btn': "Zavřít a začít experimentovat"
};
