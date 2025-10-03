import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ViewMode = 'grid' | 'list';

interface UIStore {
  // State
  theme: Theme;
  sidebarCollapsed: boolean;
  viewMode: ViewMode;
  activeTab: string;
  commandPaletteOpen: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveTab: (tab: string) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Computed
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarCollapsed: false,
      viewMode: 'grid',
      activeTab: 'home',
      commandPaletteOpen: false,

      // Set theme
      setTheme: (theme) => {
        set({ theme });

        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      // Toggle sidebar
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      // Set sidebar collapsed
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Set view mode
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      // Set active tab
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      // Toggle command palette
      toggleCommandPalette: () => {
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },

      // Set command palette open
      setCommandPaletteOpen: (open) => {
        set({ commandPaletteOpen: open });
      },

      // Get effective theme (resolving system preference)
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'ui-store',
      // Persist all UI preferences
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        viewMode: state.viewMode,
        activeTab: state.activeTab,
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const store = useUIStore.getState();
  store.setTheme(store.theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (store.theme === 'system') {
      store.setTheme('system');
    }
  });
}
