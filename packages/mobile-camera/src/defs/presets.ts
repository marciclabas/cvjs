export type Size = {
  width: number
  height: number
}

export type ResolutionPreset = '4K' | '2.7K' | '1440p' | '1080p' | '720p' | '480p'

export type AspectRatioPreset = '16:9' | '4:3'

export const PRESET_SIZES: Record<AspectRatioPreset, Record<ResolutionPreset, Size>> = {
  '16:9': {
    '4K': { width: 3840, height: 2160 },
    '2.7K': { width: 2704, height: 1520 },
    '1440p': { width: 2560, height: 1440 },
    '1080p': { width: 1920, height: 1080 },
    '720p': { width: 1280, height: 720 },
    '480p': { width: 854, height: 480 },
  },
  '4:3': {
    '4K': { width: 4096, height: 3072 },
    '2.7K': { width: 2704, height: 2028 },
    '1440p': { width: 1920, height: 1440 },
    '1080p': { width: 1440, height: 1080 },
    '720p': { width: 960, height: 720 },
    '480p': { width: 640, height: 480 },
  }
};

export const SORTED_PRESETS: ResolutionPreset[] = ['4K', '1440p', '1080p', '720p', '480p']
export function fallbackSizes(resolution: ResolutionPreset, aspectRatio: AspectRatioPreset) {
  const idx = SORTED_PRESETS.indexOf(resolution)
  return SORTED_PRESETS.slice(idx+1).map(x  => PRESET_SIZES[aspectRatio][x])
}