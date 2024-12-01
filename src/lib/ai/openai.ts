import OpenAI from 'openai';
import type { UserPreferences } from '../types';
import type { AIProvider, MealPlanResponse } from './base';
import { createPrompt, validateResponse } from './utils';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey?.trim()) {
      throw new Error('Please provide a valid API key');
    }
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateMealPlan(preferences: UserPreferences): Promise<MealPlanResponse> {
    try {
      const prompt = createPrompt(preferences);
      const stream = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        stream: true,
        temperature: 0.7
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.choices[0]?.delta?.content || '';
      }

      if (!fullResponse) {
        throw new Error('No response received from OpenAI');
      }

      return validateResponse(fullResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`OpenAI API error: ${message}`);
    }
  }
}