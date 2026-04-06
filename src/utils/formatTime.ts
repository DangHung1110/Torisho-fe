// src/utils/formatTime.ts

export function formatCommentTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getUserInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

// Deterministic avatar colour per initial so each user looks distinct
const AVATAR_COLOURS: Record<string, string> = {
  A: 'bg-violet-200 text-violet-800',
  B: 'bg-blue-200 text-blue-800',
  C: 'bg-cyan-200 text-cyan-800',
  D: 'bg-teal-200 text-teal-800',
  E: 'bg-emerald-200 text-emerald-800',
  F: 'bg-green-200 text-green-800',
  G: 'bg-lime-200 text-lime-800',
  H: 'bg-yellow-200 text-yellow-800',
  I: 'bg-amber-200 text-amber-800',
  J: 'bg-orange-200 text-orange-800',
  K: 'bg-red-200 text-red-800',
  L: 'bg-rose-200 text-rose-800',
  M: 'bg-pink-200 text-pink-800',
  N: 'bg-fuchsia-200 text-fuchsia-800',
  O: 'bg-purple-200 text-purple-800',
  P: 'bg-indigo-200 text-indigo-800',
  default: 'bg-slate-200 text-slate-700',
};

export function getAvatarColour(name: string): string {
  const initial = getUserInitial(name).toUpperCase();
  return AVATAR_COLOURS[initial] ?? AVATAR_COLOURS.default;
}