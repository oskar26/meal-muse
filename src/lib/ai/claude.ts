import Anthropic from '@anthropic-ai/sdk';
import type { UserPreferences } from '../types';
import type { AIProvider, MealPlanResponse } from './base';
import { createPrompt, validateResponse } from './utils';

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    if (!apiKey?.trim()) {
      throw new Error('Please provide a valid API key');
    }
    this.client = new Anthropic({ apiKey });
  }

  async generateMealPlan(preferences: UserPreferences): Promise<MealPlanResponse> {
    try {
      const prompt = createPrompt(preferences);
      const msg = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });

      const text = msg.content[0]?.text;
      if (!text) {
        throw new Error('No response received from Claude');
      }

      return validateResponse(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Claude API error: ${message}`);
    }
  }
}