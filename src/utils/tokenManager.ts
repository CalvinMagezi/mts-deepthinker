import { calculateCost, apiToCustomTokens } from "./tokenCalculator";
import { TOKENS_PER_GENERATION, getRemainingTokens } from "./tokenCalculator";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const FREE_CREDIT_AMOUNT = 1; // $1 in free credits
const STORAGE_KEY = "deepThinkerTokens";

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
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "unknown";
  }
}

export function getRemainingCredit(): number {
  const { totalCost } = getTokenData();
  return Math.max(0, FREE_CREDIT_AMOUNT - totalCost);
}

export function getTokenData(): TokenData {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData
    ? JSON.parse(storedData)
    : { apiTokensUsed: 0, totalCost: 0, ipAddress: "unknown" };
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

export function useTokenManager(clerkId: string) {
  const updateTokenUsage = useMutation(api.users.updateTokenUsage);
  const tokenUsage = useQuery(api.users.getTokenUsage, { clerkId });

  const canGenerateThought = () => {
    if (tokenUsage === undefined || tokenUsage === null) return false;
    return getRemainingTokens(tokenUsage) >= TOKENS_PER_GENERATION;
  };

  const consumeTokens = async () => {
    if (canGenerateThought()) {
      await updateTokenUsage({ clerkId, tokensUsed: TOKENS_PER_GENERATION });
      return true;
    }
    return false;
  };

  const getAvailableTokens = () => {
    if (tokenUsage === undefined || tokenUsage === null) return 0;
    return getRemainingTokens(tokenUsage);
  };

  return {
    canGenerateThought,
    consumeTokens,
    getAvailableTokens,
    isLoaded: tokenUsage !== undefined,
    userExists: tokenUsage !== null,
  };
}
