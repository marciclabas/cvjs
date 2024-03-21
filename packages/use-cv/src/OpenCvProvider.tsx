import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { Cv } from "./defs/opencv";
import { OpenCvContext } from "./context";
import { loadCv } from "./load";

type Props = {
  path?: string
  autoload?: boolean
}

export const defaultProps: Required<Props> = {
  path: 'https://docs.opencv.org/4.5.0/opencv.js',
  autoload: true
}

/** Loads `opencv` asynchronously using a `<script>` tag
 * - `path`: defaults to https://docs.opencv.org/4.5.0/opencv.js. You may set it to e.g. `'/opencv.js'` to use your own copy from `/public`
 * - `autoload`: defaults to `true`. Whether to immediately load the script. If set to false, you can use the `load` function (from `const { cv, load } = useOpenCv()`) to load on-demand
 */
export function OpenCvProvider({ children, ...props }: Props & PropsWithChildren) {
  const { path, autoload } = {...defaultProps, ...props}
  const [cv, setCv] = useState<Cv|null>(null)
  const loadStarted = useRef(false)

  function load() {
    if (loadStarted.current)
      return 
    loadStarted.current = true
    loadCv(path, setCv)
  }

  useEffect(() => {
    if (autoload && !cv)
      load()
  }, [autoload, cv])

  return (
    <OpenCvContext.Provider value={{ cv, load }}>
      {children}
    </OpenCvContext.Provider>
  )
}

export default OpenCvProvider