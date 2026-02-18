import { CalorieBurnResult } from '@/types/exercise';

/**
 * MET-based calorie burn calculator using the NASM formula:
 * Kcal/min = MET × 3.5 × bodyWeight(kg) / 200
 *
 * For resistance training:
 * - Active time: sets × repsPerSet × secondsPerRep
 * - Rest time: (sets - 1) × restSeconds
 * - Active calories use exercise MET (adjusted for load intensity)
 * - Rest calories use 1.5 MET (elevated post-set metabolism)
 *
 * Load intensity adjustment:
 * Heavier weights increase metabolic cost. We scale the MET value
 * using the ratio of lifted weight to body weight:
 *   adjustedMET = baseMET × (1 + liftWeight / bodyWeight × 0.2)
 * This gives ~20% more burn when lifting your body weight equivalent.
 */
export function calculateCalorieBurn(params: {
  met: number;
  bodyWeightKg: number;
  sets: number;
  repsPerSet: number;
  secondsPerRep: number;
  restSeconds: number;
  liftWeightKg?: number | null;
}): CalorieBurnResult {
  const { met, bodyWeightKg, sets, repsPerSet, secondsPerRep, restSeconds, liftWeightKg } = params;

  // Adjust MET for load intensity when lifting weight is provided
  const loadFactor = liftWeightKg && bodyWeightKg > 0
    ? 1 + (liftWeightKg / bodyWeightKg) * 0.2
    : 1;
  const adjustedMet = met * loadFactor;

  const activeSeconds = sets * repsPerSet * secondsPerRep;
  const restTotalSeconds = Math.max(0, sets - 1) * restSeconds;

  const activeMinutes = activeSeconds / 60;
  const restMinutes = restTotalSeconds / 60;

  const activeCalories = (adjustedMet * 3.5 * bodyWeightKg) / 200 * activeMinutes;
  const restCalories = (1.5 * 3.5 * bodyWeightKg) / 200 * restMinutes;

  return {
    totalCalories: Math.round((activeCalories + restCalories) * 10) / 10,
    activeCalories: Math.round(activeCalories * 10) / 10,
    restCalories: Math.round(restCalories * 10) / 10,
    activeMinutes: Math.round(activeMinutes * 10) / 10,
    restMinutes: Math.round(restMinutes * 10) / 10,
    totalMinutes: Math.round((activeMinutes + restMinutes) * 10) / 10,
  };
}
