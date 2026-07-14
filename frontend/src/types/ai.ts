export type AiChatResponse = {
  success: true;
  data: {
    conversationId: string;
    userMessage: AiChatMessage;
    assistantMessage: AiChatMessage;
    contextMetadata: {
      windowDays: number;
      recoveryScore: number;
      burnoutRiskScore: number;
      riskLevel: string;
      usedRawHistory: false;
    };
  };
  meta: {
    openAiCalled: boolean;
    fallbackUsed: boolean;
  };
};

export type AiChatMessage = {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
};
