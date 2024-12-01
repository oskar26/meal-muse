import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserPreferences } from '../types';
import type { AIProvider, MealPlanResponse } from './base';
import { createPrompt, validateResponse } from './utils';

export class GeminiProvider implements AIProvider {
  private model;

  constructor(apiKey: string) {
    if (!apiKey?.trim()) {
      throw new Error('Please provide a valid API key');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateMealPlan(preferences: UserPreferences): Promise<MealPlanResponse> {
    try {
      const prompt = createPrompt(preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response received from Gemini API');
      }

      return validateResponse(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Gemini API error: ${message}`);
    }
  }
}