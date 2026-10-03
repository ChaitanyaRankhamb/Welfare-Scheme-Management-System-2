import { Scheme } from "../entity/schemes/scheme.entity";
import type { SchemeEligibilityCriteria } from "../entity/schemes/scheme.entity";

// ─── CreateSchemeData ─────────────────────────────────────────────────────────

export interface CreateSchemeData {
  title: string;
  description: string;
  ministry: string;
  category: string;
  tags: string[];
  eligibility: Partial<SchemeEligibilityCriteria>;
  benefits: string[];
  documentsRequired: string[];
  applicationUrl?: string;
  status: "drafted" | "published" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Profile Filter ───────────────────────────────────────────────────────────

export interface SchemeProfileFilter {
  age?: number;
  income?: number;
  gender?: "male" | "female" | "other";
  state?: string;
  district?: string;
  employmentStatus?: string;
  caste?: string;
  minority?: boolean;
  disability?: boolean;
}

export interface SchemeSuggestion {
  schemeName: string;
  score: number;
}

// ─── Repository Interface ─────────────────────────────────────────────────────

export interface ISchemeRepository {
  createScheme(schemeData: CreateSchemeData): Promise<Scheme>;
  findSchemeById(id: string): Promise<Scheme | null>;
  findSchemeByName(name: string): Promise<Scheme | null>;
  findFuzzySchemeByName(name: string): Promise<SchemeSuggestion | null>;
  searchByKeywords(keywords: string[]): Promise<Scheme[]>;
  findAllSchemes(
    filters?: Record<string, unknown>,
    skip?: number,
    limit?: number,
  ): Promise<{ schemes: Scheme[]; total: number }>;
  findAllSchemesWithoutLimit(): Promise<Scheme[]>;
  searchSchemes(
    query: string,
    skip?: number,
    limit?: number,
  ): Promise<{ schemes: Scheme[]; total: number }>;
  updateScheme(id: string, scheme: Scheme): Promise<Scheme | null>;
  deleteScheme(id: string): Promise<Scheme | null>;
}
