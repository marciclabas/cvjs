import { Either } from "@haskellian/either";
import { NonEmptyArray, isNonEmpty } from '@haskellian/arrays/non-empty.js'
import { AspectRatioPreset, PRESET_SIZES, ResolutionPreset, Size, fallbackSizes } from "../defs/presets.js";
import { FacingMode } from "../defs/types.js";
import { MediaError, safeGetMedia } from "./errors.js";

export type Config = {
  facingMode?: FacingMode
}
/** Get video with ideal size `resolution` (otherwise tries with `fallbacks`) */
export async function getVideo([resolution, ...fallbacks]: NonEmptyArray<Size>, config?: Config): Promise<Either<MediaError, MediaStream>> {
  const facingMode = config?.facingMode ?? 'environment'

  const either = await safeGetMedia({ video: { ...resolution, facingMode }})

  return (either.tag === 'left' && isNonEmpty(fallbacks) && either.value.name === 'OverconstrainedError')
    ? getVideo(fallbacks, config)
    : either
  }
  
export type PresetConfig = Config & {
  /** Defaults to `2.7K` */
  resolution?: ResolutionPreset
  /** Defaults to `'4:3'` */
  aspectRatio?: AspectRatioPreset
}

/** Get video with ideal size determined by `resolution` and `config.aspectRatio`
 * - If it fails, falls back to smaller sizes with similar aspect ratio
 */
export async function getPresetVideo(config?: PresetConfig): Promise<Either<MediaError, MediaStream>> {
  const resolution = config?.resolution ?? '2.7K'
  const aspectRatio = config?.aspectRatio ?? '4:3'
  return getVideo([PRESET_SIZES[aspectRatio][resolution], ...fallbackSizes(resolution, aspectRatio)], config)
}