import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const Pmin = 0.00004;
export const Pmax = 0.1;
export const Smax = 10000000;
export const solPrice = 200; // TODO: To fetch from some other api

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

export function parseLamports(value: number): number {
  return value * LAMPORTS_PER_SOL;
}

export function formatLamports(value: number): number {
  return value / LAMPORTS_PER_SOL;
}

export function exactSolToTokens(
  S0: number,       // current supply
  C: number        // SOL to spend
): number {
  const A = (Pmax - Pmin) / (2 * Smax);
  const B = Pmin + (Pmax - Pmin) * (formatLamports(S0) / Smax);
  const discriminant = B*B + 4*A*C; // Discriminant for solving quadratic equation

  // Quadratic: A*(ΔS)^2 + B*(ΔS) - C = 0
  // ΔS = [-B ± sqrt(B² + 4AC)]/(2A), since C in the eq is negative, we actually have +4AC.

  // We take the positive root because ΔS > 0
  const deltaS = (-B + Math.sqrt(discriminant)) / (2*A);
  return deltaS;
}

export function solToExactTokens(
  S0: number,      // current supply
  deltaS: number  // number of attention tokens to buy
): number {
  return Pmin * deltaS
    + ((Pmax - Pmin) / (2 * Smax)) * ((formatLamports(S0) + deltaS)**2 - formatLamports(S0)**2);
}

export function exactTokensToSol(
  S0: number,       // current supply
  deltaS: number,   // amount of attention tokens being sold
): number {
  return Pmin * deltaS
    + ((Pmax - Pmin) / (2 * Smax)) * (2 * formatLamports(S0) * deltaS - deltaS**2);
}

export function tokensToExactSol(
  S0: number,       // current supply
  C: number        // SOL you want
): number {
  const A = -(Pmax - Pmin) / (2 * Smax);
  const B = Pmin + (Pmax - Pmin) * (formatLamports(S0) / Smax);
  // Equation: A(ΔS)^2 + B(ΔS) - C = 0

  const discriminant = B*B + 4*A*C;
  // ΔS = [-B ± sqrt(B² + 4AC)]/(2A)
  // Since A is negative, we must still choose the positive solution that yields a positive ΔS.
  const deltaS = (-B + Math.sqrt(discriminant)) / (2*A);
  return deltaS;
}


// // TODO: confirm bonding curve formula
// export function calculateSol(
//   S0: number,     // current supply
//   deltaS: number, // number of tokens to buy
//   Pmin: number,   // minimum price
//   Pmax: number,   // maximum price
//   Smax: number,    // total supply
//   spread: number, // percentage of the price to add
// ): number {
//   if (deltaS === 0) {
//     return 0;
//   }
//   if (deltaS > 0) {
//     // Buying tokens
//     const baseCost =
//       Pmin * deltaS +
//       ((Pmax - Pmin) / (3 * Math.pow(Smax, 2))) *
//         (Math.pow(S0 + deltaS, 3) - Math.pow(S0, 3));
//     return baseCost * (1 + spread);
//   } else {
//     // Selling tokens
//     const absoluteDeltaS = Math.abs(deltaS);
//     const baseRefund =
//       Pmin * absoluteDeltaS +
//       ((Pmax - Pmin) / (3 * Math.pow(Smax, 2))) *
//         (Math.pow(S0, 3) - Math.pow(S0 + deltaS, 3));
//     return baseRefund * (1 - spread);
//   }
// }