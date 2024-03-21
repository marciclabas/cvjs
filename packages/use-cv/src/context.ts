import { createContext, useContext } from "react"
import { Cv } from "./defs/opencv"

export type OpenCvCtx = {
  cv: Cv | null
  load(): void
}
export const OpenCvContext = createContext<OpenCvCtx>({ cv: null, async load() {} })
export const useOpenCv = () => useContext(OpenCvContext)