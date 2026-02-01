
export enum SymptomCategory {
  RESPIRATORY = 'Respiratory',
  GASTROINTESTINAL = 'Gastrointestinal',
  NEUROLOGICAL = 'Neurological',
  DERMATOLOGICAL = 'Dermatological',
  SYSTEMIC = 'Systemic'
}

export interface HealthRiskVector {
  scores: Record<SymptomCategory, number>;
  timestamp: number;
  geoHash: string; // Fuzzy location
}

export interface CohortSnapshot {
  id: string;
  timestamp: number;
  size: number;
  aggregateScores: Record<SymptomCategory, number>;
  privacyEpsilon: number; // Differential Privacy parameter
  isSealed: boolean;
  zkpProof: string; // Mock ZKP string
}

export interface PrivacyMetrics {
  noiseLevel: number;
  anonymitySet: number;
  gradientFragments: number;
}
