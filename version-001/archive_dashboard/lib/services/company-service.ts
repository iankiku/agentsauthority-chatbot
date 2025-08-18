// TODO: Re-enable when company tables are added to schema
// import {
// 	organizations,
// 	websites,
// 	scans,
// } from "@workspace/database";
// import { and, asc, desc, eq } from "drizzle-orm";
// import { nanoid } from "nanoid";
// import { db } from "../db";

export interface CompanyData {
	name: string;
	url: string;
	industry?: string;
	description?: string;
	logo?: string;
	favicon?: string;
	scrapedData?: any;
	isActive?: boolean;
}

export interface Competitor {
	id: string;
	companyId: string;
	name: string;
	url: string;
	domain?: string;
	description?: string;
	industry?: string;
	logo?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface BrandAnalysisResult {
	id: string;
	companyId: string;
	userId: string;
	analysis: any;
	score: number;
	isLatest: boolean;
	createdAt: Date;
	updatedAt: Date;
	promptsData?: any;
	analysisType?: string;
	creditsUsed?: number;
}

// TODO: Re-enable when company tables are added to schema
export class CompanyService {
	/**
	 * Create a new company (temporarily disabled)
	 */
	static async createCompany(userId: string, companyData: CompanyData) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Get company by ID for a specific user (temporarily disabled)
	 */
	static async getCompany(userId: string, companyId: string) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Get all companies for a user (temporarily disabled)
	 */
	static async getUserCompanies(userId: string) {
		// TODO: Implement with correct schema
		return [];
	}

	/**
	 * Update company (temporarily disabled)
	 */
	static async updateCompany(
		userId: string,
		companyId: string,
		updates: Partial<CompanyData>
	) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Delete company (temporarily disabled)
	 */
	static async deleteCompany(userId: string, companyId: string) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Add competitor (temporarily disabled)
	 */
	static async addCompetitor(
		companyId: string,
		competitorData: Partial<Competitor>
	) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Get competitors for a company (temporarily disabled)
	 */
	static async getCompetitors(companyId: string) {
		// TODO: Implement with correct schema
		return [];
	}

	/**
	 * Remove competitor (temporarily disabled)
	 */
	static async removeCompetitor(competitorId: string) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Save brand analysis result (temporarily disabled)
	 */
	static async saveBrandAnalysisResult(
		userId: string,
		companyId: string,
		analysis: any,
		score: number,
		promptsData?: any,
		analysisType?: string,
		creditsUsed?: number
	) {
		// TODO: Implement with correct schema
		throw new Error(
			"Company service temporarily disabled during schema migration"
		);
	}

	/**
	 * Get latest analysis (temporarily disabled)
	 */
	static async getLatestAnalysis(userId: string, companyId: string) {
		// TODO: Implement with correct schema
		return null;
	}

	/**
	 * Get analysis history (temporarily disabled)
	 */
	static async getAnalysisHistory(
		userId: string,
		companyId: string,
		limit = 10
	) {
		// TODO: Implement with correct schema
		return [];
	}

	/**
	 * Find company by URL (temporarily disabled)
	 */
	static async findCompanyByUrl(userId: string, url: string) {
		// TODO: Implement with correct schema
		return null;
	}
}
