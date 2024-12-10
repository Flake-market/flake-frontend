import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(value: string): string {
  const sanitized = value.replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    parts.pop();
  }
  return parts.join('.');
}


// TODO: confirm bonding curve formula
export function calculateSol(
  S0: number,     // current supply
  deltaS: number, // number of tokens to buy
  Pmin: number,   // minimum price
  Pmax: number,   // maximum price
  Smax: number,    // total supply
  spread: number, // percentage of the price to add
): number {
  if (deltaS === 0) {
    return 0;
  }
  if (deltaS > 0) {
    // Buying tokens
    const baseCost =
      Pmin * deltaS +
      ((Pmax - Pmin) / (3 * Math.pow(Smax, 2))) *
        (Math.pow(S0 + deltaS, 3) - Math.pow(S0, 3));
    return baseCost * (1 + spread);
  } else {
    // Selling tokens
    const absoluteDeltaS = Math.abs(deltaS);
    const baseRefund =
      Pmin * absoluteDeltaS +
      ((Pmax - Pmin) / (3 * Math.pow(Smax, 2))) *
        (Math.pow(S0, 3) - Math.pow(S0 + deltaS, 3));
    return baseRefund * (1 - spread);
  }
}

