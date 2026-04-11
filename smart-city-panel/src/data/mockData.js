// src/data/mockData.js

export const BEACH_ENTRIES = [
  { id: 'w38', name: 'Wejście 38', status: 'green',  sandOccupancy: 22, binOccupancy: 35, tourists: 1240, coords: { x: 5,  y: 6 } },
  { id: 'w40', name: 'Wejście 40', status: 'yellow', sandOccupancy: 58, binOccupancy: 72, tourists: 3180, coords: { x: 10, y: 6 } },
  { id: 'w42', name: 'Wejście 42', status: 'red',    sandOccupancy: 95, binOccupancy: 98, tourists: 5420, coords: { x: 16, y: 6 } },
  { id: 'w43', name: 'Wejście 43', status: 'yellow', sandOccupancy: 67, binOccupancy: 55, tourists: 2840, coords: { x: 20, y: 6 } },
  { id: 'w45', name: 'Wejście 45', status: 'green',  sandOccupancy: 31, binOccupancy: 28, tourists: 1650, coords: { x: 25, y: 6 } },
  { id: 'w47', name: 'Wejście 47', status: 'green',  sandOccupancy: 14, binOccupancy: 18, tourists:  880, coords: { x: 30, y: 6 } },
  { id: 'w49', name: 'Wejście 49', status: 'yellow', sandOccupancy: 72, binOccupancy: 81, tourists: 3720, coords: { x: 35, y: 6 } },
  { id: 'w51', name: 'Wejście 51', status: 'red',    sandOccupancy: 88, binOccupancy: 90, tourists: 4900, coords: { x: 40, y: 6 } },
];

export const LIVE_ALERTS = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'WOPR: KRYTYCZNIE',
    message: 'Zablokowany korytarz życia na Wejściu 42! Wyślij interwencję.',
    entry: 'w42',
    time: '22:09',
    icon: '🚨',
    actionLabel: 'Dysponuj patrol',
    source: 'system',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Przepełnione kosze',
    message: 'Wejście 42 – kosze na śmieci przepełnione w 98%. Pilna interwencja.',
    entry: 'w42',
    time: '22:04',
    icon: '🗑️',
    actionLabel: 'Wyślij służby',
    source: 'system',
  },
  {
    id: 'a3',
    severity: 'warning',
    title: 'Tłok – kosze Wejście 49',
    message: 'Kosze w 81%. Zalecana wymiana w ciągu 30 min.',
    entry: 'w49',
    time: '21:55',
    icon: '⚠️',
    actionLabel: 'Planuj odbiór',
    source: 'system',
  },
  {
    id: 'a4',
    severity: 'info',
    title: 'Gamifikacja aktywna',
    message: 'Wysłano 143 propozycje do turystów z Wejść 42 i 51. Oczekiwany odpływ: ~200 os.',
    entry: null,
    time: '21:48',
    icon: '🎯',
    actionLabel: 'Szczegóły',
    source: 'system',
  },
];

// Typy komunikatów kryzysowych dla admina
export const BROADCAST_TYPES = [
  { id: 'algae',    icon: '⚠️',  label: 'Sinice – Zakaz kąpieli',    severity: 'critical' },
  { id: 'child',    icon: '🚩',  label: 'Zagubione dziecko',          severity: 'critical' },
  { id: 'storm',    icon: '🌪️',  label: 'Możliwy sztorm',             severity: 'warning'  },
  { id: 'noguard',  icon: '❌',  label: 'Brak ratowników',            severity: 'critical' },
  { id: 'wopr',     icon: '🏊',  label: 'Akcja ratownicza WOPR',      severity: 'critical' },
  { id: 'info',     icon: 'ℹ️',  label: 'Komunikat informacyjny',     severity: 'info'     },
];

export const PREDICTION = {
  date: 'jutro',
  temp: 28,
  wind: 25,
  windDir: 'NW',
  condition: 'Słonecznie z silnym wiatrem',
  parasol_effect: 'extreme',
  predicted_drop: 40,
  total_expected: 24800,
  recommendations: [
    'Włączyć zniżki odciążające na Wejściach 38, 45, 47',
    'Zwiększyć patrole WOPR na Wejściach 42 i 51',
    'Uruchomić system nagłośnienia z komunikatami przekierowującymi',
    'Przygotować 3 dodatkowe brygady wywozu odpadów',
  ],
};

export const STATS = {
  totalTourists: 18432,
  avgOccupancy: 63,
  activeProposals: 143,
  rewardsIssued: 89,
};

// Dane godzinowe dla analityki (8:00–20:00)
export const HOURLY_DATA = [
  { hour: '8:00',  w38: 180, w40: 220, w42: 310, w43: 190, w45: 140, w47: 90,  w49: 240, w51: 280 },
  { hour: '9:00',  w38: 310, w40: 420, w42: 580, w43: 340, w45: 250, w47: 160, w49: 440, w51: 510 },
  { hour: '10:00', w38: 520, w40: 680, w42: 920, w43: 560, w45: 430, w47: 280, w49: 710, w51: 830 },
  { hour: '11:00', w38: 740, w40: 980, w42:1340, w43: 810, w45: 620, w47: 400, w49:1020, w51:1190 },
  { hour: '12:00', w38: 890, w40:1180, w42:1680, w43: 980, w45: 780, w47: 510, w49:1280, w51:1450 },
  { hour: '13:00', w38: 990, w40:1320, w42:1960, w43:1120, w45: 870, w47: 570, w49:1480, w51:1690 },
  { hour: '14:00', w38:1080, w40:1440, w42:2240, w43:1210, w45: 950, w47: 620, w49:1620, w51:1840 },
  { hour: '15:00', w38:1180, w40:1560, w42:2580, w43:1380, w45:1050, w47: 680, w49:1780, w51:2100 },
  { hour: '16:00', w38:1140, w40:1510, w42:2420, w43:1330, w45:1020, w47: 660, w49:1710, w51:1980 },
  { hour: '17:00', w38: 960, w40:1280, w42:2010, w43:1090, w45: 840, w47: 540, w49:1430, w51:1640 },
  { hour: '18:00', w38: 710, w40: 940, w42:1450, w43: 790, w45: 610, w47: 390, w49:1040, w51:1210 },
  { hour: '19:00', w38: 430, w40: 580, w42: 870, w43: 480, w45: 370, w47: 230, w49: 630, w51: 720 },
  { hour: '20:00', w38: 190, w40: 260, w42: 380, w43: 210, w45: 160, w47: 100, w49: 280, w51: 320 },
];

// Dane tygodniowe dla wykresu słupkowego
export const WEEKLY_STATS = [
  { day: 'Pon', tourists: 12400, alerts: 3 },
  { day: 'Wt',  tourists: 14200, alerts: 2 },
  { day: 'Śr',  tourists: 11800, alerts: 5 },
  { day: 'Czw', tourists: 16900, alerts: 4 },
  { day: 'Pt',  tourists: 18432, alerts: 7 },
  { day: 'Sob', tourists: 22100, alerts: 8 },
  { day: 'Nd',  tourists: 24800, alerts: 6 },
];
