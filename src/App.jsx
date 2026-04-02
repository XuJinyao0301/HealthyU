import { useMemo, useState } from "react";
import {
  HeartPulse,
  Moon,
  Salad,
  Dumbbell,
  Brain,
  Clock3,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  UserRound,
  Sparkles,
} from "lucide-react";

const FIVE_OPTIONS = [
  ["Strongly Agree", 5],
  ["Agree", 4],
  ["Neutral", 3],
  ["Disagree", 2],
  ["Strongly Disagree", 1],
];

const questions = [
  {
    id: "sleep_1",
    dimension: "Sleep",
    title:
      "Even before an early morning class, I usually go to sleep at a relatively regular time.",
    options: FIVE_OPTIONS,
  },
  {
    id: "sleep_2",
    dimension: "Sleep",
    title:
      "I often stay up late, even when I know I will feel tired the next day.",
    options: FIVE_OPTIONS,
  },
  {
    id: "sleep_3",
    dimension: "Sleep",
    title:
      "When I wake up on weekdays, I usually feel rested enough to focus in class.",
    options: FIVE_OPTIONS,
  },
  {
    id: "sleep_4",
    dimension: "Sleep",
    title:
      "I often delay sleep because of scrolling, gaming, or entertainment.",
    options: FIVE_OPTIONS,
  },
  {
    id: "diet_1",
    dimension: "Diet",
    title:
      "Even during busy school days, I usually eat meals at a fairly regular time.",
    options: FIVE_OPTIONS,
  },
  {
    id: "diet_2",
    dimension: "Diet",
    title:
      "I often choose convenience food or skip meals because it is faster.",
    options: FIVE_OPTIONS,
  },
  {
    id: "diet_3",
    dimension: "Diet",
    title:
      "I usually include fruit, vegetables, or protein in at least one main meal each day.",
    options: FIVE_OPTIONS,
  },
  {
    id: "diet_4",
    dimension: "Diet",
    title:
      "I often drink too little water during the day unless I remind myself.",
    options: FIVE_OPTIONS,
  },
  {
    id: "exercise_1",
    dimension: "Exercise",
    title:
      "I usually make time for exercise or physical activity during the week.",
    options: FIVE_OPTIONS,
  },
  {
    id: "exercise_2",
    dimension: "Exercise",
    title:
      "After classes, I usually spend most of my time sitting or lying down.",
    options: FIVE_OPTIONS,
  },
  {
    id: "exercise_3",
    dimension: "Exercise",
    title:
      "I usually walk enough during the day to avoid being inactive for too long.",
    options: FIVE_OPTIONS,
  },
  {
    id: "exercise_4",
    dimension: "Exercise",
    title:
      "I often go through a whole day with almost no intentional movement because of study pressure.",
    options: FIVE_OPTIONS,
  },
  {
    id: "stress_1",
    dimension: "Stress",
    title:
      "When academic tasks pile up, I can usually stay calm and deal with them step by step.",
    options: FIVE_OPTIONS,
  },
  {
    id: "stress_2",
    dimension: "Stress",
    title:
      "Even after I stop studying, stress often stays with me for a long time.",
    options: FIVE_OPTIONS,
  },
  {
    id: "stress_3",
    dimension: "Stress",
    title:
      "I can usually notice when stress is building before it affects my whole day.",
    options: FIVE_OPTIONS,
  },
  {
    id: "stress_4",
    dimension: "Stress",
    title:
      "When I feel stressed, I often keep it to myself and do nothing about it.",
    options: FIVE_OPTIONS,
  },
  {
    id: "routine_1",
    dimension: "Daily Routine",
    title: "My daily routine is generally stable, even during busy weeks.",
    options: FIVE_OPTIONS,
  },
  {
    id: "routine_2",
    dimension: "Daily Routine",
    title:
      "I often sacrifice sleep, meals, or rest just to keep up with college life.",
    options: FIVE_OPTIONS,
  },
  {
    id: "routine_3",
    dimension: "Daily Routine",
    title:
      "I usually have a workable plan for study, meals, and rest on weekdays.",
    options: FIVE_OPTIONS,
  },
  {
    id: "routine_4",
    dimension: "Daily Routine",
    title:
      "My schedule often changes so much that healthy habits become hard to keep.",
    options: FIVE_OPTIONS,
  },
];

const reverseQuestionIds = [
  "sleep_2",
  "sleep_4",
  "diet_2",
  "diet_4",
  "exercise_2",
  "exercise_4",
  "stress_2",
  "stress_4",
  "routine_2",
  "routine_4",
];

const icons = {
  Sleep: Moon,
  Diet: Salad,
  Exercise: Dumbbell,
  Stress: Brain,
  "Daily Routine": Clock3,
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function normalizeScore(questionId, value) {
  if (!value) return 0;
  return reverseQuestionIds.includes(questionId) ? 6 - value : value;
}

function getBMI(weight, heightCm) {
  const h = Number(heightCm) / 100;
  const w = Number(weight);
  if (!h || !w || h <= 0 || w <= 0) return null;
  return (w / (h * h)).toFixed(1);
}

function getType(scores) {
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0]?.[0];

  if (!weakest) return "The Balanced Builder";
  if (weakest === "Sleep") return "The Midnight Striver";
  if (weakest === "Stress") return "The Pressure Carrier";
  if (weakest === "Exercise") return "The Sedentary Dreamer";
  if (weakest === "Diet") return "The Convenience Eater";
  return "The Chaotic Survivor";
}

function getLevel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Average";
  if (score >= 40) return "Needs Attention";
  return "High Risk";
}

function getInterpretation(overall, wellnessType, weakest, info) {
  const name = info.name?.trim() || "Student";
  const yearText = info.year ? `${info.year.toLowerCase()} student` : "college student";

  if (overall >= 82) {
    return `${name}, your lifestyle looks relatively balanced for a ${yearText}. You seem to maintain healthier habits across most dimensions.`;
  }
  if (overall >= 65) {
    return `${name}, your overall condition is fairly stable, but ${weakest.toLowerCase()} is the main factor pulling your result down right now.`;
  }
  if (overall >= 50) {
    return `${name}, your current pattern suggests strain in daily life. As ${wellnessType}, you may often trade healthy habits for convenience or productivity.`;
  }
  return `${name}, your habits appear to be under real pressure. Improving consistency in your routine should be the first priority.`;
}

function buildAdvice(scores) {
  const advice = [];

  if ((scores.Sleep ?? 0) < 70) {
    advice.push({
      title: "Sleep Reset",
      items: [
        "Try to keep a more consistent sleep window for the next 7 days.",
        "Reduce phone use for about 30 minutes before bed.",
        "Do not leave heavy tasks to very late night whenever possible.",
      ],
    });
  }

  if ((scores.Diet ?? 0) < 70) {
    advice.push({
      title: "Smarter Eating",
      items: [
        "Avoid skipping breakfast or lunch on busy class days.",
        "Keep one balanced meal in your day even when work gets heavy.",
        "Aim to replace one convenience meal with a more balanced meal each day.",
      ],
    });

    advice.push({
      title: "Hydration Reminder",
      items: [
        "Keep a water bottle nearby during classes or study sessions.",
        "Try drinking water at regular points in the day instead of waiting until you feel very thirsty.",
        "Use a simple goal such as refilling your bottle two or three times a day.",
      ],
    });
  }

  if ((scores.Exercise ?? 0) < 70) {
    advice.push({
      title: "Move More",
      items: [
        "Add 20 to 30 minutes of walking, jogging, or sports at least 3 times this week.",
        "Break long sitting periods with short movement every hour.",
        "Use one free afternoon for light outdoor activity instead of staying seated all day.",
      ],
    });
  }

  if ((scores.Stress ?? 0) < 70) {
    advice.push({
      title: "Stress Management",
      items: [
        "Split large tasks into smaller daily goals.",
        "Leave short breaks between study blocks.",
        "Choose one reliable way to decompress each evening, such as walking, stretching, or journaling.",
      ],
    });
  }

  if ((scores["Daily Routine"] ?? 0) < 70) {
    advice.push({
      title: "Routine Repair",
      items: [
        "Try to keep wake-up time more stable on weekdays.",
        "Plan study, meals, and rest before your day becomes chaotic.",
        "Protect one healthy habit first, then build around it.",
      ],
    });
  }

  if (advice.length === 0) {
    advice.push({
      title: "Maintain Your Momentum",
      items: [
        "Keep your current balance of sleep, meals, movement, stress control, and hydration.",
        "Track one healthy habit each week to stay consistent.",
        "Do not let busy periods erase your routines completely.",
      ],
    });
  }

  return advice;
}

function getPersonalSummary(info, weakest) {
  const pieces = [];

  if (info.year) {
    pieces.push(`As a ${info.year.toLowerCase()} student`);
  } else {
    pieces.push("As a college student");
  }

  if (info.age) {
    pieces.push(`aged ${info.age}`);
  }

  if (weakest) {
    pieces.push(`your current weakest area is ${weakest.toLowerCase()}`);
  }

  return `${pieces.join(", ")}, the most useful next step is building one stable habit and protecting it during busy weeks.`;
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value || "--"}</div>
    </div>
  );
}

function ScaleRow({ q, answers, setAnswers }) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex justify-between text-sm text-slate-500">
        <span>Agree</span>
        <span>Disagree</span>
      </div>

      <div className="flex items-end justify-between gap-3">
        {q.options.map(([label, value], index) => {
          const sizeClasses = [
            "h-16 w-16",
            "h-14 w-14",
            "h-12 w-12",
            "h-14 w-14",
            "h-16 w-16",
          ];

          const isSelected = answers[q.id] === value;

          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, [q.id]: value })}
                className={`${sizeClasses[index]} rounded-full border-2 transition ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]"
                    : "border-slate-300 bg-white hover:border-emerald-400"
                }`}
                title={label}
                aria-label={`${q.title} - ${label}`}
              />
              <span className="mt-3 text-center text-xs text-slate-600">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-emerald-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    year: "",
  });
  const [answers, setAnswers] = useState({});

  const infoComplete =
    info.age && info.gender && info.height && info.weight && info.year;

  const allAnswered = questions.every((q) => answers[q.id]);

  const result = useMemo(() => {
    const grouped = {};
    for (const q of questions) {
      if (!grouped[q.dimension]) grouped[q.dimension] = [];
      grouped[q.dimension].push(normalizeScore(q.id, answers[q.id]));
    }

    const scores = {};
    for (const key of Object.keys(grouped)) {
      const arr = grouped[key];
      const total = arr.reduce((a, b) => a + b, 0);
      scores[key] = Math.round((total / (arr.length * 5)) * 100);
    }

    const values = Object.values(scores);
    const overall = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;

    const bmi = getBMI(info.weight, info.height);
    const actualAge = Number(info.age) || 20;
    const healthAge = clamp(
      actualAge + Math.round((70 - overall) / 8),
      actualAge - 3,
      actualAge + 8
    );
    const wellnessType = getType(scores);
    const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
    const weakest = sorted[0]?.[0] || "Daily Routine";
    const advice = buildAdvice(scores);
    const interpretation = getInterpretation(overall, wellnessType, weakest, info);
    const personalSummary = getPersonalSummary(info, weakest);

    return {
      scores,
      overall,
      bmi,
      healthAge,
      wellnessType,
      weakest,
      advice,
      interpretation,
      personalSummary,
    };
  }, [answers, info]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  SDG 3 · Good Health and Well-being
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <HeartPulse className="h-8 w-8 text-emerald-300" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">CampusPulse</h1>
                    <p className="mt-1 text-slate-300">
                      A health assessment website designed for college students
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 bg-white p-6 md:grid-cols-4">
            {[
              "1. Intro & Info",
              "2. Scenario Questions",
              "3. Health Assessment",
              "4. Health Advice",
            ].map((item, i) => (
              <div
                key={item}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  step === i + 1
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Introduction & Basic Information</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              This website evaluates college students’ sleep, diet, hydration, exercise,
              stress, and daily routine. It then generates a health score, a
              health age, a wellness type, and practical suggestions.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                placeholder="Name (optional)"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                placeholder="Age"
                type="number"
                value={info.age}
                onChange={(e) => setInfo({ ...info, age: e.target.value })}
              />
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                value={info.gender}
                onChange={(e) => setInfo({ ...info, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                value={info.year}
                onChange={(e) => setInfo({ ...info, year: e.target.value })}
              >
                <option value="">Select year</option>
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Postgraduate</option>
              </select>
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                placeholder="Height (cm)"
                type="number"
                value={info.height}
                onChange={(e) => setInfo({ ...info, height: e.target.value })}
              />
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                placeholder="Weight (kg)"
                type="number"
                value={info.weight}
                onChange={(e) => setInfo({ ...info, weight: e.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={() => infoComplete && setStep(2)}
              className={`mt-6 rounded-2xl px-5 py-3 font-medium transition ${
                infoComplete
                  ? "bg-slate-900 text-white hover:bg-emerald-600"
                  : "cursor-not-allowed bg-slate-300 text-white"
              }`}
            >
              Start Assessment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Scenario-Based Questions</h2>
              <p className="mt-2 text-slate-600">
                Read each statement and choose how well it describes your real college life.
              </p>
            </div>

            {questions.map((q, idx) => {
              const Icon = icons[q.dimension];
              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2 text-slate-500">
                    <Icon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">
                      {idx + 1}. {q.dimension}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold leading-8">{q.title}</h3>
                  <ScaleRow q={q} answers={answers} setAnswers={setAnswers} />
                </div>
              );
            })}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => allAnswered && setStep(3)}
                className={`rounded-2xl px-5 py-3 font-medium transition ${
                  allAnswered
                    ? "bg-slate-900 text-white hover:bg-emerald-600"
                    : "cursor-not-allowed bg-slate-300 text-white"
                }`}
              >
                Generate Assessment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Health Assessment</h2>
              <p className="mt-2 text-slate-600">
                This result is for wellness awareness only and is not a medical diagnosis.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-900 p-5 text-white">
                  <div className="text-sm text-slate-300">Health Score</div>
                  <div className="mt-2 text-4xl font-bold text-emerald-300">{result.overall}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-sm text-slate-500">Actual Age</div>
                  <div className="mt-2 text-4xl font-bold">{info.age || "--"}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-sm text-slate-500">Health Age</div>
                  <div className="mt-2 text-4xl font-bold">{result.healthAge}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-sm text-slate-500">BMI</div>
                  <div className="mt-2 text-4xl font-bold">{result.bmi ?? "--"}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Dimension Analysis</h3>
                <div className="mt-4 space-y-4">
                  {Object.entries(result.scores).map(([key, value]) => (
                    <ScoreBar key={key} label={`${key} · ${getLevel(value)}`} value={value} />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Wellness Type</h3>
                <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white">
                  <div className="text-2xl font-bold text-emerald-300">{result.wellnessType}</div>
                  <p className="mt-2 text-slate-300">
                    A simplified profile based on your lower-scoring health dimension.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-slate-700">
                  {result.interpretation}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-emerald-600"
                  >
                    View Health Advice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Health Advice</h2>
              <p className="mt-2 max-w-3xl text-slate-600">
                This section combines personalized suggestions with short wellness knowledge cards,
                so the result page is not only descriptive but also educational.
              </p>
            </div>

            <div className="mx-auto max-w-5xl space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-900 p-6 text-white">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-emerald-300" />
                    <h3 className="text-xl font-semibold">Personal Profile</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {result.personalSummary}
                  </p>
                </div>

                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  <Field label="Name" value={info.name || "Anonymous"} />
                  <Field label="Age" value={info.age} />
                  <Field label="Gender" value={info.gender} />
                  <Field label="Year" value={info.year} />
                  <Field label="Height" value={info.height ? `${info.height} cm` : "--"} />
                  <Field label="Weight" value={info.weight ? `${info.weight} kg` : "--"} />
                  <Field label="BMI" value={result.bmi ?? "--"} />
                  <Field label="Weakest Area" value={result.weakest} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Personalized Suggestions</h3>
                <div className="mt-4 space-y-4">
                  {result.advice.map((block) => (
                    <div
                      key={block.title}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="font-semibold text-emerald-700">{block.title}</div>
                      <ul className="mt-3 space-y-2 text-slate-700">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-2xl bg-slate-50 px-4 py-3"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold">7-Day Improvement Focus</h3>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {[
                    "Day 1 · Move your bedtime 20 to 30 minutes earlier.",
                    "Day 2 · Carry a water bottle and refill it at least twice.",
                    "Day 3 · Walk or exercise for 25 minutes.",
                    "Day 4 · Eat one balanced meal without rushing.",
                    "Day 5 · Add a short break after each major study block.",
                    "Day 6 · Reduce late-night screen use before sleep.",
                    "Day 7 · Review which healthy habit was easiest to keep.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold">Health Knowledge Corner</h3>
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                      <Moon className="h-4 w-4 text-emerald-600" /> Sleep
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      Sleep duration matters. Teens aged 13 to 17 generally need 8 to 10 hours of sleep,
                      while adults aged 18 to 60 are recommended to get at least 7 hours. Going to bed at
                      a more regular time often helps recovery and daytime focus.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                      <Dumbbell className="h-4 w-4 text-emerald-600" /> Exercise
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      Regular movement protects both physical and mental well-being. A common benchmark for
                      adults is at least 150 minutes of moderate-intensity activity per week, which can be
                      split into short sessions instead of one long workout.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                      <Salad className="h-4 w-4 text-emerald-600" /> Hydration & Meals
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      Hydration is not only about drinking a lot at once. Drinking regularly through the day is
                      more practical, and pale yellow urine is often used as a simple sign that hydration is in a
                      reasonable range. Regular meals also support steadier energy.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                      <Brain className="h-4 w-4 text-emerald-600" /> Stress
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      Stress can affect both mind and body, including concentration, sleep, and energy. Helpful
                      coping strategies often include regular sleep, exercise, short breaks, and staying connected
                      with supportive people instead of carrying pressure alone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold">Small Reminder</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  This website is suitable for health awareness and habit reflection. It should not be used as a
                  medical diagnosis tool. If someone has ongoing sleep problems, severe stress, or clear health
                  concerns, they should talk to a qualified professional.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setAnswers({});
                      setInfo({
                        name: "",
                        age: "",
                        gender: "",
                        height: "",
                        weight: "",
                        year: "",
                      });
                    }}
                    className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-emerald-600"
                  >
                    Restart Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
