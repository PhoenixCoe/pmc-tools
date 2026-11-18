import type { AppMeta } from '@/lib/types';

export const meta: AppMeta = {
  n: 28,
  category: "productivity-student",
  slug: "pomodoro-focus-studio",
  title: "Timer",
  description: "Set a timer, run a stopwatch with laps, count down to a date, or use a focus timer with breaks.",
  tagline: "Timer & stopwatch",
  keywords: ["timer","pomodoro","focus","studio"],
  mode: "local",
  faq: [
    { q: "Do I need an account to use the timer?", a: "No. It works the moment the page loads. An account is optional and only adds saving and syncing across devices." },
    { q: "Does my data leave my device?", a: "No. Timer runs entirely in your browser, so what you enter is never uploaded." },
    { q: "Is the timer free?", a: "Yes. It is free to use, with no sign-up, trial or usage wall." },
  ],
  built: true,
};
