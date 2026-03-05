import { create } from 'zustand';
import type { CameraTarget, ColorMode, System, Theme } from './types.js';

export interface BrainStore {
  selectedRegionId: string | null;
  hoveredRegionId: string | null;
  colorMode: ColorMode;
  activeTheme: Theme | null;
  activeSystem: System | null;
  explodeFactor: number;
  searchQuery: string;
  cameraTarget: CameraTarget | null;

  selectRegion: (id: string | null) => void;
  hoverRegion: (id: string | null) => void;
  setColorMode: (mode: ColorMode) => void;
  setActiveTheme: (theme: Theme | null) => void;
  setActiveSystem: (system: System | null) => void;
  setExplodeFactor: (factor: number) => void;
  setSearchQuery: (query: string) => void;
  focusRegion: (position: [number, number, number]) => void;
  setCameraView: (position: [number, number, number]) => void;
  clearCameraTarget: () => void;
  reset: () => void;
}

export const useBrainStore = create<BrainStore>((set) => ({
  selectedRegionId: null,
  hoveredRegionId: null,
  colorMode: 'theme',
  activeTheme: null,
  activeSystem: null,
  explodeFactor: 0,
  searchQuery: '',
  cameraTarget: null,

  selectRegion: (id) => set({ selectedRegionId: id }),
  hoverRegion: (id) => set({ hoveredRegionId: id }),
  setColorMode: (mode) => set({ colorMode: mode, activeTheme: null, activeSystem: null }),
  setActiveTheme: (theme) => set((s) => ({ activeTheme: s.activeTheme === theme ? null : theme })),
  setActiveSystem: (system) => set((s) => ({ activeSystem: s.activeSystem === system ? null : system })),
  setExplodeFactor: (factor) => set({ explodeFactor: factor }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  focusRegion: (position) =>
    set({
      cameraTarget: {
        position: [position[0] * 1.5 + 2, position[1] + 1.5, position[2] + 4],
        lookAt: position,
      },
    }),
  setCameraView: (position) =>
    set({
      selectedRegionId: null,
      cameraTarget: {
        position,
        lookAt: [0, 0, 0],
      },
    }),
  clearCameraTarget: () => set({ cameraTarget: null }),
  reset: () =>
    set({
      selectedRegionId: null,
      hoveredRegionId: null,
      activeTheme: null,
      activeSystem: null,
      explodeFactor: 0,
      searchQuery: '',
      cameraTarget: null,
    }),
}));
