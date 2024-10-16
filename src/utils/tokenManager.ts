import { calculateCost, apiToCustomTokens, customToApiTokens } from './tokenCalculator';

const FREE_CREDIT_AMOUNT = 1; // $1 in free credits
const STORAGE_KEY = 'deepThinkerTokens';

interface TokenData {
  apiTokensUsed: number;
  totalCost: number;
  ipAddress: string;
}

export async function initializeTokenManager(): Promise<TokenData> {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }

  const ipAddress = await fetchIPAddress();
  const newData: TokenData = {
    apiTokensUsed: 0,
    totalCost: 0,
    ipAddress,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
}

async function fetchIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'unknown';
  }
}

export function getRemainingCredit(): number {
  const { totalCost } = getTokenData();
  return Math.max(0, FREE_CREDIT_AMOUNT - totalCost);
}

export function getTokenData(): TokenData {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : { apiTokensUsed: 0, totalCost: 0, ipAddress: 'unknown' };
}

export function updateTokenUsage(newTokens: number, cost: number): void {
  const data = getTokenData();
  data.apiTokensUsed += newTokens;
  data.totalCost += cost;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function canGenerateThought(inputTokens: number): boolean {
  const remainingCredit = getRemainingCredit();
  const estimatedCost = calculateCost(inputTokens, 50); // Assume 50 output tokens
  return estimatedCost <= remainingCredit;
}

export function getAvailableCustomTokens(): number {
  const remainingCredit = getRemainingCredit();
  const remainingApiTokens = Math.floor(remainingCredit / calculateCost(1, 0));
  return apiToCustomTokens(remainingApiTokens);
}