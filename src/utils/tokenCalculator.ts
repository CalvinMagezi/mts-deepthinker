// Approximate token calculation based on GPT-3 tokenizer
export function calculateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Calculate cost based on input and output tokens
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (0.15 / 1000000) * inputTokens;
  const outputCost = (0.60 / 1000000) * outputTokens;
  return inputCost + outputCost;
}

// Custom token system (1 custom token = 100 API tokens)
export function apiToCustomTokens(apiTokens: number): number {
  return Math.ceil(apiTokens / 100);
}

export function customToApiTokens(customTokens: number): number {
  return customTokens * 100;
}