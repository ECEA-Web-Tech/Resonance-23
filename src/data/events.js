// Source: R'26_EVENTS.docx. Used to seed Firestore and as the offline fallback.
export const CATEGORIES = [
  { id: "tech", label: "Technical", code: "T" },
  { id: "nontech", label: "Non-technical", code: "N" },
  { id: "workshop", label: "Workshop", code: "W" },
];

/** Adds a stable display id per category, e.g. RES-T01, in the order the events are listed. */
export function withCodes(events) {
  const seen = {};
  return events.map((e) => {
    const code = CATEGORIES.find((c) => c.id === e.category)?.code ?? "X";
    seen[code] = (seen[code] ?? 0) + 1;
    return { ...e, code: `RES-${code}${String(seen[code]).padStart(2, "0")}` };
  });
}

const drive = (id) => `https://drive.google.com/file/d/${id}/view`;

export default [
  {
    id: "logic-league",
    category: "tech",
    name: "Logic League",
    description:
      "Logic League is a two-stage technical event designed to test participants’ knowledge, analytical thinking, teamwork, and practical electronics skills. The event begins with a quiz round covering general aptitude and visually challenging questions. Qualified teams will advance to a hands-on Circuit Battle where they must build and troubleshoot circuits while competing against opponents using strategic power-ups earned through technical challenges. The event encourages technical excellence, quick thinking, and collaborative problem-solving.",
    poster: drive("1arQBnZxMotD8BJYRBTPEjRJhb_zOD_9Q"),
    register: "https://forms.gle/nVrcrGtMvxEhSRzH8",
    pocs: [
      { name: "Shree Naren S", phone: "9488910501" },
      { name: "Shreehan S Nayak", phone: "9175907998" },
    ],
    venue: "DSP lab",
    team: "2 members",
    date: "09.10.2026",
  },
  {
    id: "circuit-heist",
    category: "tech",
    name: "Circuit Heist",
    description:
      "Circuit heist is a technical event that requires both analytical problem-solving skills, practical circuit and logic-solving skills. Event will happen in two rounds and participants will face a list of problems that test both their knowledge and application of core concepts behind the circuits. It’s thrilling electronics-based challenge where participants should act like circuit detectives to crack the clues and predict the output to solve the problems. With each successful challenge, participants move one step closer to cracking the heist. Think fast, connect smart, and crack the circuit before the time runs out!",
    poster: drive("19LfxXL4HarrkAQQFyOGPocc1X19anpOT"),
    register: "https://forms.gle/N8PTwE4VGdumD8Qz5",
    pocs: [
      { name: "Shree Naren S", phone: "9488910501" },
      { name: "Madhava Krishnan S", phone: "9486176542" },
    ],
    venue: "Computer lab",
    team: "2 members",
    date: "09.10.2026",
  },
  {
    id: "pitch-or-perish",
    category: "tech",
    name: "Pitch or Perish",
    description:
      "Pitch or Perish is a business strategy and problem-solving event where teams must build a business idea from limited resources and then defend it when unexpected challenges threaten their business. The event tests creativity, business thinking, adaptability, teamwork, and pitching skills.",
    poster: drive("1iQ1tTGFZ-3d9NHxLlvqyj2kfKjkTlf-K"),
    register: "https://forms.gle/qxbLYBH4daBGeL3i6",
    pocs: [
      { name: "Shree Naren S", phone: "9488910501" },
      { name: "Harshithaa Sri K N", phone: "9123501049" },
    ],
    venue: "Lecture hall, 2nd floor",
    team: "2–3 members",
    date: "09.10.2026",
  },
  {
    id: "escape-the-grid",
    category: "tech",
    name: "Escape the Grid",
    description:
      "Escape the Grid is an immersive, escape-room-style technical event designed to test core engineering fundamentals through high-pressure problem solving. Participants begin with a comprehensive written evaluation covering essential communications, signals, and circuit theory. Top qualifiers are then thrust into a simulated emergency scenario stranded on an isolated island; teams must solve a sequence of chained technical challenges, decode vital parameters, and retrieve a 6-digit activation code to send a final distress transmission before time runs out. The event combines analytical rigor, practical application, and team strategy to select the ultimate problem solvers.",
    poster: drive("1u8cE0ssT5i1x5Gf7roxJ-jsDHwur0fTK"),
    register: "https://forms.gle/JvzLKh9BatnZg5Ni7",
    pocs: [
      { name: "Thosithaa Lakshmi N", phone: "9444498420" },
      { name: "Shree Naren S", phone: "9488910501" },
    ],
    venue: "First floor, lecture hall 2",
    team: "2 members",
    date: "09.10.2026",
  },
  {
    id: "kadhaipoma",
    category: "nontech",
    name: "Kadhaipoma",
    description:
      "Kadhaipoma is a fun and interactive two-round event that tests participants’ communication, understanding, teamwork, and creativity. The event begins with an interaction-based question round, where participants get to know each other before answering a set of questions based on their understanding of one another. The second round features exciting Drawing and You/Me challenges that test communication and coordination. With unexpected answers, creative challenges, and plenty of fun, Kadhaipoma promises an entertaining experience for everyone.",
    poster: drive("1uRTfCD2eK3n0_AA7ujm1wb2DOYscC5fe"),
    register: "https://forms.gle/cnDvtrbF8PKsFz3TA",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Deeksha A", phone: "9962211395" },
    ],
    venue: "Ground floor lecture hall",
    date: "09.10.2026",
  },
  {
    id: "thiraiyum-naanum",
    category: "nontech",
    name: "Thiraiyum Naanum",
    description:
      "Thiraiyum Naanum is a cinema-based challenge that tests participants’ movie knowledge, observation, reasoning, and teamwork. Participants begin with a 25-question PPT-based round, followed by an exciting Envelope Challenge involving clues, codes, and increasing levels of difficulty. Teams must solve the questions, identify the correct answers, and unlock the corresponding codes to progress further. The final challenge involves identifying the correct evidence and unlocking the Audio Evidence to solve the mystery. Get ready to put your cinema knowledge and presence of mind to the test!",
    poster: drive("1l-mOAeU5lxk8t49F3Yw_ji5lCWTCCghU"),
    register: "https://forms.gle/NZLaDfKFoShqMQ5J8",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Hidha S", phone: "8939369428" },
    ],
    venue: "First floor lecture hall 1",
    team: "2–3 members",
    date: "09.10.2026",
  },
  {
    id: "meme-exe",
    category: "nontech",
    name: "MEME.EXE",
    description:
      "MEME.EXE, conducted in collaboration with Quizzers Anonymous, is a fun and engaging quiz that tests participants’ knowledge of memes, viral trends, digital culture, and quick thinking. The event begins with a 25-question PPT-based round, followed by a multi-stage quiz featuring Pounce & Bounce, Differential Scoring, and Long Visual Connect challenges. With visual clues, strategic gameplay, and multiple opportunities to score, participants must think fast and play smart. Get ready for a fun-filled and competitive meme showdown!",
    poster: drive("1inCObZ_JyPIk6lMxpSynEB0qQvk2b8-F"),
    register: "https://forms.gle/uhf2B4CDawYCqYpX6",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Manoranjan U", phone: "9788687286" },
    ],
    venue: "Mini Auditorium",
    team: "2–3 members",
    date: "09.10.2026",
  },
  {
    id: "checkmate",
    category: "nontech",
    name: "Checkmate",
    tagline: "Chess, in collaboration with Castle Red",
    description:
      "Step into the world of strategy, patience, and calculated moves with Checkmate, the chess event of Resonance. This battle of minds is all about planning ahead, making smart decisions, and staying one step ahead of your opponent. Every move can change the game, and every decision matters. Whether you rely on tactical brilliance or a well-planned strategy, get ready to put your chess skills to the ultimate test. Think carefully, play confidently, and make your final move count as you battle your way towards checkmate!",
    poster: drive("1XkjMuZLQ-m_CSx2pdRyRJJ3fFdrIOXj3"),
    register: "https://forms.gle/Gqjs4R9Rq825BxQx8",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Sudharshan", phone: "9943784561" },
    ],
    mode: "Online",
    fee: "Rs. 30",
    date: "03.10.2026",
    closed: true,
  },
  {
    id: "flight-mode",
    category: "nontech",
    name: "Flight Mode",
    tagline: "Badminton",
    description:
      "Get ready to experience the speed, energy, and excitement of badminton with Flight Mode! This fast-paced event challenges participants to showcase their agility, reflexes, precision, and competitive spirit on the court. From quick rallies and powerful smashes to perfectly timed shots, every moment demands focus and control. Bring your best game, stay alert, and be prepared to move with every shot. Step onto the court, take flight, and let your skills do the talking!",
    poster: drive("1JS0HquIbTuKloZrkX4IdQp5MyAxDWIIl"),
    register: "https://forms.gle/iDwDmTaSkuU7DDcb8",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Hari Rakkesh A", phone: "9445061017" },
    ],
    venue: "Badminton Court, AU CEG Sports Ground",
    team: "Doubles (boys), singles (girls)",
    fee: "Rs. 50 doubles, Rs. 30 singles",
    closed: true,
  },
  {
    id: "powerplay",
    category: "nontech",
    name: "Powerplay",
    tagline: "Cricket",
    description:
      "Get ready to step onto the field and experience the excitement of cricket with Powerplay! This action-packed event brings together teamwork, strategy, skill, and the true spirit of competition. From powerful hits and quick runs to crucial wickets and spectacular catches, every moment can turn the game around. Work together, make smart decisions, and give your best on every ball. Gather your team, bring your energy, and get ready to make every run, wicket, and moment count in the ultimate cricket showdown!",
    poster: drive("1VdunwnkrqvEBQXKQFDR53f0hKgamuaQQ"),
    register: "https://forms.gle/fGoLg7nEHqcevvrK6",
    pocs: [
      { name: "Monitha S", phone: "6385331005" },
      { name: "Hari Rakkesh A", phone: "9445061017" },
    ],
    venue: "AU CEG Sports Ground",
    team: "Boys, team of 11",
    fee: "Rs. 200 per team",
    closed: true,
  },
  {
    id: "embiotx",
    category: "workshop",
    name: "EMBIOTX",
    tagline: "Embedded & IoT workshop with Retech Solutions",
    description:
      "EMBIOTX is an Embedded and IoT workshop organized by the Projects & Workshops Domain of ECEA in association with Retech Solutions. The workshop aims to provide students with practical exposure to the fundamentals of Embedded systems and Internet of Things Technologies. Through technical sessions, demonstrations and hands-on learning, participants will gain an understanding of how embedded devices, sensors, controllers and IoT technologies work together to build real-world applications. The workshop is intended to bridge theoretical concepts with practical implementation and encourage students to explore Embedded and IoT based projects.",
    poster: drive("12pyffrD5PQJxYIDnCkf5eeZxDaPZSPq1"),
    register: "https://forms.gle/zLxwDjmY9wu4Wfev7",
    pocs: [
      { name: "Vignesh", phone: "9360516500" },
      { name: "Varsha", phone: "6374425624" },
    ],
    venue: "ECE Department",
    fee: "Rs. 50 per person",
    date: "10.10.2026",
    time: "9 AM to 12 PM",
    closed: true,
  },
].map((e, i) => ({ order: i, ...e }));
