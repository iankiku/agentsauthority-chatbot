import { Company, BrandPrompt } from '../lib/types';

export async function generatePromptsForCompany(company: Company, competitors: string[]): Promise<string[]> {
  const prompts: string[] = [];
  let promptId = 0;

  const brandName = company.name;
  const industry = company.industry || 'technology';

  const templates = [
    `What are the top 10 {industry} tools in 2024?`,
    `List the best {industry} platforms available today`,
    `Compare the top 5 {industry} tools including {brand}`,
    `What are the best alternatives to {brand}?`,
  ];

  templates.forEach(template => {
    prompts.push(
      template.replace('{industry}', industry).replace('{brand}', brandName)
    );
  });

  return prompts;
}
