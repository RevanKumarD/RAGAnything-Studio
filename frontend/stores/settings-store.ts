import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  type: 'llm' | 'vision' | 'embedding';
}

export interface ParserSettings {
  parser: 'mineru' | 'docling';
  parseMethod: 'auto' | 'ocr' | 'txt';
  enableImageProcessing: boolean;
  enableTableProcessing: boolean;
  enableEquationProcessing: boolean;
}

export interface QuerySettings {
  defaultMode: 'hybrid' | 'local' | 'global' | 'naive';
  enableVLM: boolean;
  topK: number;
  temperature: number;
}

interface SettingsStore {
  // State
  apiUrl: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  defaultLLMModel: string;
  defaultVisionModel: string;
  defaultEmbeddingModel: string;

  parserSettings: ParserSettings;
  querySettings: QuerySettings;

  availableModels: AIModel[];

  // Actions
  setApiUrl: (url: string) => void;
  setOpenAIApiKey: (key: string) => void;
  setOpenAIBaseUrl: (url: string) => void;
  setDefaultLLMModel: (model: string) => void;
  setDefaultVisionModel: (model: string) => void;
  setDefaultEmbeddingModel: (model: string) => void;

  updateParserSettings: (settings: Partial<ParserSettings>) => void;
  updateQuerySettings: (settings: Partial<QuerySettings>) => void;

  addModel: (model: AIModel) => void;
  removeModel: (id: string) => void;

  resetSettings: () => void;
}

const defaultParserSettings: ParserSettings = {
  parser: 'mineru',
  parseMethod: 'auto',
  enableImageProcessing: true,
  enableTableProcessing: true,
  enableEquationProcessing: true,
};

const defaultQuerySettings: QuerySettings = {
  defaultMode: 'hybrid',
  enableVLM: false,
  topK: 10,
  temperature: 0.7,
};

const defaultModels: AIModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'llm' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', type: 'llm' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', type: 'llm' },
  { id: 'gpt-4o', name: 'GPT-4o Vision', provider: 'openai', type: 'vision' },
  { id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', provider: 'openai', type: 'embedding' },
];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      openaiApiKey: '',
      openaiBaseUrl: 'https://api.openai.com/v1',
      defaultLLMModel: 'gpt-4o-mini',
      defaultVisionModel: 'gpt-4o',
      defaultEmbeddingModel: 'text-embedding-3-large',

      parserSettings: defaultParserSettings,
      querySettings: defaultQuerySettings,

      availableModels: defaultModels,

      // Set API URL
      setApiUrl: (url) => {
        set({ apiUrl: url });
      },

      // Set OpenAI API Key
      setOpenAIApiKey: (key) => {
        set({ openaiApiKey: key });
      },

      // Set OpenAI Base URL
      setOpenAIBaseUrl: (url) => {
        set({ openaiBaseUrl: url });
      },

      // Set default LLM model
      setDefaultLLMModel: (model) => {
        set({ defaultLLMModel: model });
      },

      // Set default vision model
      setDefaultVisionModel: (model) => {
        set({ defaultVisionModel: model });
      },

      // Set default embedding model
      setDefaultEmbeddingModel: (model) => {
        set({ defaultEmbeddingModel: model });
      },

      // Update parser settings
      updateParserSettings: (settings) => {
        set((state) => ({
          parserSettings: { ...state.parserSettings, ...settings },
        }));
      },

      // Update query settings
      updateQuerySettings: (settings) => {
        set((state) => ({
          querySettings: { ...state.querySettings, ...settings },
        }));
      },

      // Add custom model
      addModel: (model) => {
        set((state) => ({
          availableModels: [...state.availableModels, model],
        }));
      },

      // Remove custom model
      removeModel: (id) => {
        set((state) => ({
          availableModels: state.availableModels.filter((m) => m.id !== id),
        }));
      },

      // Reset to defaults
      resetSettings: () => {
        set({
          apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
          openaiApiKey: '',
          openaiBaseUrl: 'https://api.openai.com/v1',
          defaultLLMModel: 'gpt-4o-mini',
          defaultVisionModel: 'gpt-4o',
          defaultEmbeddingModel: 'text-embedding-3-large',
          parserSettings: defaultParserSettings,
          querySettings: defaultQuerySettings,
          availableModels: defaultModels,
        });
      },
    }),
    {
      name: 'settings-store',
      // Persist all settings
    }
  )
);
