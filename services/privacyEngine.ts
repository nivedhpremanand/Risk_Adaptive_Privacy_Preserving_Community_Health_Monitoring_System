
import { SymptomCategory, HealthRiskVector, CohortSnapshot } from '../types';

export const calculateLocalRiskVector = (selectedSymptoms: SymptomCategory[]): Record<SymptomCategory, number> => {
  const scores: Record<SymptomCategory, number> = {
    [SymptomCategory.RESPIRATORY]: 0,
    [SymptomCategory.GASTROINTESTINAL]: 0,
    [SymptomCategory.NEUROLOGICAL]: 0,
    [SymptomCategory.DERMATOLOGICAL]: 0,
    [SymptomCategory.SYSTEMIC]: 0,
  };

  selectedSymptoms.forEach(cat => {
    scores[cat] = Math.random() * 0.5 + 0.5; // Simulated coarse weight
  });

  return scores;
};

export const applyDifferentialPrivacy = (value: number, epsilon: number): number => {
  // Laplace mechanism simplified simulation
  const noise = (Math.random() - 0.5) / (epsilon + 0.1);
  return Math.max(0, Math.min(1, value + noise));
};

export const createSnapshot = (vectors: HealthRiskVector[], epsilon: number): CohortSnapshot => {
  const size = vectors.length;
  const aggregate: Record<SymptomCategory, number> = {
    [SymptomCategory.RESPIRATORY]: 0,
    [SymptomCategory.GASTROINTESTINAL]: 0,
    [SymptomCategory.NEUROLOGICAL]: 0,
    [SymptomCategory.DERMATOLOGICAL]: 0,
    [SymptomCategory.SYSTEMIC]: 0,
  };

  Object.values(SymptomCategory).forEach(cat => {
    const sum = vectors.reduce((acc, v) => acc + v.scores[cat], 0);
    const mean = sum / size;
    aggregate[cat] = applyDifferentialPrivacy(mean, epsilon);
  });

  return {
    id: `cohort-${Date.now()}`,
    timestamp: Date.now(),
    size,
    aggregateScores: aggregate,
    privacyEpsilon: epsilon,
    isSealed: true,
    zkpProof: `sha256:0x${Math.random().toString(16).slice(2, 18)}`
  };
};
