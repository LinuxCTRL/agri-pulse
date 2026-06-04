import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseMaturityDays(seasonStr: string | null): number | null {
  if (!seasonStr) return null;

  // Look for numbers in the string (e.g., "75-80", "80 days", "Midseason")
  const matches = seasonStr.match(/\d+/g);
  if (!matches) return null;

  // If it's a range, take the average or the higher end?
  // Let's take the higher end for conservative estimation
  const numbers = matches.map(Number);
  return Math.max(...numbers);
}

export function calculateHarvestInfo(plantedAt: string, maturityDays: number | null) {
  if (!maturityDays) return null;

  const plantedDate = new Date(plantedAt);
  const harvestDate = new Date(plantedDate);
  harvestDate.setDate(plantedDate.getDate() + maturityDays);

  const today = new Date();
  const totalDays = maturityDays;
  const daysPassed = Math.max(
    0,
    Math.floor((today.getTime() - plantedDate.getTime()) / (1000 * 3600 * 24)),
  );
  const daysRemaining = Math.max(0, totalDays - daysPassed);
  const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));

  return {
    harvestDate,
    daysRemaining,
    progress,
    isOverdue: today > harvestDate,
  };
}
