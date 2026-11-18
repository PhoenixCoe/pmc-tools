import type { Category, GroupKey } from './types';

export const categories: Category[] = [
  { slug: 'text-formatting', key: 'text', name: 'Text & Formatting', blurb: 'Change text, tidy code, compare two texts.', short: 'Text' },
  { slug: 'file-media', key: 'file', name: 'File & Media', blurb: 'Pictures, sound, PDFs and other files.', short: 'Files' },
  { slug: 'productivity-student', key: 'prod', name: 'Productivity & Student', blurb: 'Timers, planners, flashcards and everyday helpers.', short: 'Study' },
  { slug: 'developer-data', key: 'dev', name: 'Developer & Data', blurb: 'Encode, decode, check and generate.', short: 'Dev' },
  { slug: 'business-web', key: 'biz', name: 'Business & Web', blurb: 'For your website and your business.', short: 'Web' },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

/** The colours of each group. The same values are in globals.css as [data-g] rules; the tab icon and share cards read them from here. */
export const GROUP_COLOURS: Record<GroupKey | 'home', { bg: string; fg: string; sh: string }> = {
  home: { bg: '#171717', fg: '#FBF6EC', sh: '#171717' },
  text: { bg: '#337957', fg: '#FBF6EC', sh: '#1A4934' },
  file: { bg: '#B94A2C', fg: '#FBF6EC', sh: '#6E2A15' },
  prod: { bg: '#2F5D9E', fg: '#FBF6EC', sh: '#1B3760' },
  dev: { bg: '#6B4FA0', fg: '#FBF6EC', sh: '#3F2D66' },
  biz: { bg: '#D9A524', fg: '#171717', sh: '#85600F' },
};
