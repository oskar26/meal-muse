import type { UserPreferences } from '../types';
import type { AIProvider } from './base';
import { OpenAIProvider } from './openai';
import { ClaudeProvider } from './claude';
import { GeminiProvider } from './gemini';

export function createAIProvider(preferences: UserPreferences): AIProvider {
  const { aiProvider, apiKey } = preferences;

  if (!apiKey?.trim()) {
    throw new Error('Please provide a valid API key in your preferences');
  }

  switch (aiProvider) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'claude':
      return new ClaudeProvider(apiKey);
    case 'gemini':
      return new GeminiProvider(apiKey);
    default:
      throw new Error('Invalid AI provider selected');
  }
}