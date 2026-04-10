// src/data/mockData.ts
export type BeachStatus = 'green' | 'yellow' | 'red';

export interface AdminAlert {
  id: string;
  icon: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface BeachEntry {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: BeachStatus;
  occupancy: number;
  nearestGreen?: string;
  distance?: string;
  adminAlerts?: AdminAlert[];  // alerty od admina dla tego wejścia
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  discount: string;
  partner: string;
  expiresAt: string;
  used: boolean;
  qrCode: string;
}

// ── Dane wejść z alertami admina ────────────────────────────────────────────
export const BEACH_ENTRIES: BeachEntry[] = [
  {
    id: 'w38', name: 'Wejście 38',
    lat: 54.5162, lng: 18.5301,
    status: 'green', occupancy: 22,
  },
  {
    id: 'w40', name: 'Wejście 40',
    lat: 54.5160, lng: 18.5340,
    status: 'yellow', occupancy: 58,
    nearestGreen: 'w38', distance: '300m',
  },
  {
    id: 'w42', name: 'Wejście 42',
    lat: 54.5158, lng: 18.5380,
    status: 'red', occupancy: 95,
    nearestGreen: 'w45', distance: '400m',
    adminAlerts: [
      {
        id: 'aa1',
        icon: '⚠️',
        title: 'Uwaga: Wykryto sinice!',
        message: 'Zakaz kąpieli na Wejściu 42. Woda może być szkodliwa dla zdrowia. Prosimy nie wchodzić do morza.',
        severity: 'critical',
      },
      {
        id: 'aa2',
        icon: '🚨',
        title: 'Akcja ratownicza WOPR',
        message: 'Trwa akcja ratownicza. Prosimy zachować spokój i odsunąć się od linii wody.',
        severity: 'critical',
      },
    ],
  },
  {
    id: 'w43', name: 'Wejście 43',
    lat: 54.5157, lng: 18.5400,
    status: 'yellow', occupancy: 67,
    nearestGreen: 'w45', distance: '200m',
    adminAlerts: [
      {
        id: 'aa3',
        icon: '🌪️',
        title: 'Możliwy sztorm',
        message: 'Prognozowane silne wiatry od 17:00. Zalecamy opuszczenie plaży przed tą godziną.',
        severity: 'warning',
      },
    ],
  },
  {
    id: 'w45', name: 'Wejście 45',
    lat: 54.5155, lng: 18.5435,
    status: 'green', occupancy: 31,
  },
  {
    id: 'w47', name: 'Wejście 47',
    lat: 54.5153, lng: 18.5470,
    status: 'green', occupancy: 14,
  },
  {
    id: 'w49', name: 'Wejście 49',
    lat: 54.5151, lng: 18.5505,
    status: 'yellow', occupancy: 72,
    nearestGreen: 'w47', distance: '350m',
    adminAlerts: [
      {
        id: 'aa4',
        icon: '🚩',
        title: 'Zagubione dziecko',
        message: 'Chłopiec ok. 6 lat, niebieska koszulka. Jeśli go widzisz zgłoś się do ratownika WOPR.',
        severity: 'warning',
      },
    ],
  },
  {
    id: 'w51', name: 'Wejście 51',
    lat: 54.5149, lng: 18.5540,
    status: 'red', occupancy: 88,
    nearestGreen: 'w47', distance: '650m',
  },
];

// ── Nagrody ─────────────────────────────────────────────────────────────────
export const REWARDS: Reward[] = [
  {
    id: 'r1',
    title: '6 zł zniżki',
    description: 'Przy zakupie za min. 50 zł w Smażalni Rybnej',
    discount: '-6 zł',
    partner: 'Smażalnia Rybna "Neptun"',
    expiresAt: '2026-08-31',
    used: false,
    qrCode: 'DENSEA-SMN-2026-R1X7',
  },
  {
    id: 'r2',
    title: '-10% na lody i gofry',
    description: 'W Lodziarni & Gofriarni "Pod Mewą"',
    discount: '-10%',
    partner: 'Pod Mewą',
    expiresAt: '2026-08-15',
    used: false,
    qrCode: 'DENSEA-MEW-2026-R2K4',
  },
  {
    id: 'r3',
    title: 'Darmowy parking',
    description: '2h bezpłatnego parkowania na Parkingu Centralnym',
    discount: '2h FREE',
    partner: 'Parking Centralny Sopot',
    expiresAt: '2026-09-01',
    used: true,
    qrCode: 'DENSEA-PRK-2026-R3M9',
  },
];

// ── Dane gracza (grywalizacja) ───────────────────────────────────────────────
export const PLAYER = {
  name: 'Turysta',
  level: 3,
  levelName: 'Odkrywca Plaż',
  nextLevelName: 'Złoty Surfer',
  xp: 300,
  xpRequired: 500,
  totalVisits: 3,
  greenVisits: 2,
  badges: 4,
};
