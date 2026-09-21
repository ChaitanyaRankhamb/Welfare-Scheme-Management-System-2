export interface RecommendedScheme {
  title: string;
  score?: number;
  category?: string;
  ministry?: string;
  benefits?: string;
}

export interface StreamStep {
  type: 'status' | 'intent' | 'info' | 'success' | 'error' | 'result' | 'metadata' | 'content' | 'recommendations' | 'scheme_details';
  message?: string;
  content?: string;
  data?: any;
}

export interface EligibilityCriterion {
  label: string;
  met: boolean | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  recommendations?: RecommendedScheme[];
  schemeTitle?: string;
  requiredDocuments?: string[];
  eligibilityMatrix?: EligibilityCriterion[];
  isError?: boolean;
  steps?: StreamStep[];
  timestamp: string;
  followUps?: string[];
}
