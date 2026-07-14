import { apiClient } from './client';
import type { AiChatResponse } from '../types/ai';

export async function askAiCoach(message: string): Promise<AiChatResponse> {
  const response = await apiClient.post<AiChatResponse>('/ai/chat', {
    message,
  });

  return response.data;
}
