/* ------------------------------------------------------------------
   All copy below is taken from https://corehaus.es/
------------------------------------------------------------------- */
import studioHero from "@/assets/studio-hero.jpg";
import studioPortrait from "@/assets/studio-portrait.jpg";
import strengthImg from "@/assets/strength.jpg";
import tensionImg from "@/assets/tension.jpg";
import experienceImg from "@/assets/experience.jpg";
import detailImg from "@/assets/detail.jpg";
import djImg from "@/assets/dj.jpg";

export const IMAGES = {
  studioHero,
  studioPortrait,
  strength: strengthImg,
  tension: tensionImg,
  experience: experienceImg,
  detail: detailImg,
  dj: djImg,
};

export const LINKS = {
  booking: "https://corehaus.es/schedule",
  login: "https://momence.com/sign-in?hostId=47062",
  instagram: "https://www.instagram.com/corehaus_es/",
  tiktok: "https://www.tiktok.com/@corehaus_es",
  email: "team@corehaus.es",
};

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Schedule", href: "#schedule" },
  { label: "Packages", href: "#packages" },
] as const;

export const CTA = {
  bookClass: "Book your class",
  bookMyClass: "Book my class",
  buyPackage: "Buy a class / package",
  login: "Log In",
};

export const HERO = {
  headline: "CREATE THE STRONGEST VERSION OF YOURSELF",
  leadBefore: "A 50\u2011minute, high\u2011intensity, low\u2011impact workout that will ",
  leadStrong: "sculpt, tone, and strengthen",
  leadAfter: " every muscle of your body. Get ready to sweat, shake, and keep coming back for more.",
};

export const PROMO = {
  eyebrow: "SUMMER PROMO",
  offers: [
    { discount: "15% OFF", title: "5 & 8 Class Packs", code: "STRONGSEPTEMBER" },
    { discount: "10% OFF", title: "4 & 8 classes/month Membership", code: "STRONGSEPTEMBER10" },
  ],
  message:
    "Get yours now. Start to give yourself the work and love you deserve with us in September! \u{1F336}\uFE0F",
  cta: "GET YOUR PACKAGE HERE",
};

export const ABOUT = {
  titleTop: "Strengthen,",
  titleMid: "Tone &",
  titleBottom: "Sculpt",
  statement:
    "Corehaus is a 50-minute high-intensity, low-impact resistance workout on our custom machines.",
};

export type Feature = {
  n: string;
  title: string;
  body: string;
  image: string;
};

export const FEATURES: Feature[] = [
  {
    n: "01",
    title: "STRENGTH TRAINING",
    body: "The best of pilates, weight training, and resistance training to build strength, a leaner physique, and toned muscles",
    image: strengthImg,
  },
  {
    n: "02",
    title: "TIME UNDER TENSION",
    body: "Slow and controlled movements that specifically target key muscle groups, all while ensuring minimal strain on the organs and joints.",
    image: tensionImg,
  },
  {
    n: "03",
    title: "A ONE-OF-A-KIND EXPERIENCE",
    body: "Paired with DJ\u2011curated playlists and instructors fueling your \u201Cyes, I can\u201D mindset, you\u2019ll leave motivated, supported, and seeing results immediately.",
    image: experienceImg,
  },
];

/* ------------------------------------------------------------------
   Schedule — daily muscle focus transcribed from the official
   "August-Schedule" calendar (lower body & upper body per day).
------------------------------------------------------------------- */
export const SCHEDULE = {
  eyebrow: "Monthly",
  title: "Calendar",
  body: "Each day of the week we alternate between different muscle groups for the lower and upper body to allow your body to recover between days while sufficiently bringing specific muscle groups to failure every time you come!",
  month: "August",
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FIRST_WEEKDAY_INDEX = 4; // 01 August falls on a Friday on the official calendar

const FOCUS: (readonly [lower: string, upper: string] | null)[] = [
  ["Outer Glutes", "Back"],
  ["Hamstrings", "Biceps"],
  ["Leg Wrap", "Shoulders"],
  ["Center Glutes", "Arm Wrap"],
  ["Inner Thighs", "Back"],
  ["Outer Glutes", "Biceps"],
  ["Hamstrings", "Chest"],
  ["Center Glutes", "Shoulders"],
  ["Leg Wrap", "Back"],
  ["Hamstrings", "Triceps"],
  ["Inner Thighs", "Biceps"],
  ["Outer Glutes", "Arm Wrap"],
  ["Center Glutes", "Chest"],
  null,
  null,
  null,
  null,
  ["Inner Thighs", "Triceps"],
  ["Outer Glutes", "Biceps"],
  ["Hamstrings", "Arm Wrap"],
  ["Inner Thighs", "Back"],
  ["Leg Wrap", "Shoulders"],
  ["Center Glutes", "Biceps"],
  ["Hamstrings", "Back"],
  ["Outer Glutes", "Arm Wrap"],
  ["Inner Thighs", "Triceps"],
  ["Center Glutes", "Chest"],
  ["Leg Wrap", "Biceps"],
  ["Center Glutes", "Back"],
  ["Hamstrings", "Shoulders"],
  ["Inner Thighs", "Arm Wrap"],
];

/**
 * Session start times — placeholder slots for the booking UI.
 * Replace with live times from the booking provider (Momence).
 */
const SESSION_TIMES = {
  weekday: ["07:00", "08:15", "09:30", "13:30", "18:00", "19:15", "20:30"],
  weekend: ["09:30", "10:45", "12:00"],
};

export type ScheduleDay = {
  date: number;
  weekday: string;
  short: string;
  isWeekend: boolean;
  lower?: string;
  upper?: string;
};

export type Session = { start: string; end: string };

export const SCHEDULE_DAYS: ScheduleDay[] = FOCUS.map((focus, i) => {
  const weekday = WEEKDAYS[(FIRST_WEEKDAY_INDEX + i) % 7];
  return {
    date: i + 1,
    weekday,
    short: weekday.slice(0, 3),
    isWeekend: weekday === "Saturday" || weekday === "Sunday",
    lower: focus?.[0],
    upper: focus?.[1],
  };
});

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export const getSessions = (day: ScheduleDay): Session[] => {
  if (!day.lower) return [];
  const times = day.isWeekend ? SESSION_TIMES.weekend : SESSION_TIMES.weekday;
  return times.map((start) => ({ start, end: addMinutes(start, 50) }));
};

/* ------------------------------------------------------------------
   Packages & Memberships
------------------------------------------------------------------- */
export const PACKAGES = {
  title: "Packages",
  titleAccent: "& Memberships",
  lines: [
    "Choose between class packages or monthly memberships.",
    "Our memberships come with exclusive perks designed to elevate your Corehaus experience.",
  ],
};

export type Plan = {
  name: string;
  price: string;
  perClass?: string;
  details: string[];
  promo?: { code: string; discount: string };
  cta: string;
  href: string;
};

export type PlanGroup = { id: string; title: string; plans: Plan[] };

export const PLAN_GROUPS: PlanGroup[] = [
  {
    id: "intro",
    title: "Intro Offers",
    plans: [
      {
        name: "INTRO OFFER",
        price: "59€",
        details: ["3 classes", "expires after 15 days"],
        cta: "SIGN ME UP",
        href: "https://momence.com/m/430535",
      },
      {
        name: "2 WEEKS UNLIMITED",
        price: "129€",
        details: ["INTRO OFFER.", "Expires in 15 days"],
        cta: "SIGN ME UP",
        href: "https://momence.com/m/445530",
      },
    ],
  },
  {
    id: "packages",
    title: "Packages",
    plans: [
      {
        name: "SINGLE CLASS",
        price: "29€",
        details: ["expires after 15 days"],
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/430489",
      },
      {
        name: "5 PACK CLASS",
        price: "119€",
        perClass: "24€/class",
        details: ["expires after 30 days"],
        promo: { code: "STRONGSEPTEMBER", discount: "15% OFF" },
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/430528",
      },
      {
        name: "8 PACK CLASS",
        price: "179€",
        perClass: "22€/class",
        details: ["expires after 45 days"],
        promo: { code: "STRONGSEPTEMBER", discount: "15% OFF" },
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/430530",
      },
      {
        name: "12 PACK CLASS",
        price: "259€",
        perClass: "21.5€/class",
        details: ["expires after 60 days"],
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/430531",
      },
    ],
  },
  {
    id: "memberships",
    title: "Memberships",
    plans: [
      {
        name: "4 CLASSES / MONTH",
        price: "96€",
        perClass: "24€/class",
        details: ["*minimum 3 months"],
        promo: { code: "STRONGSEPTEMBER10", discount: "10% OFF" },
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/430547",
      },
      {
        name: "8 CLASSES / MONTH",
        price: "169€",
        perClass: "21€/class",
        details: ["*minimum 3 months"],
        promo: { code: "STRONGSEPTEMBER10", discount: "10% OFF" },
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/444552",
      },
      {
        name: "12 CLASSES / MONTH",
        price: "249€",
        perClass: "20.5€/class",
        details: ["*minimum 3 months"],
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/444553",
      },
      {
        name: "UNLIMITED",
        price: "329€",
        perClass: "16.5€/class",
        details: ["*minimum 3 months"],
        cta: "I WANT THIS ONE",
        href: "https://momence.com/m/444554",
      },
    ],
  },
];

export const MARQUEE_WORDS = [
  "STRENGTH TRAINING",
  "TIME UNDER TENSION",
  "A ONE-OF-A-KIND EXPERIENCE",
];
