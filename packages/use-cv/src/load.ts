import { Cv } from "./defs/opencv";

/** Load OpenCV from the given `path`. Creates a `<script>` tag
 * - Why not a promise? For some reason it hangs, idk.
*/
export const loadCv = (path: string, callback: (cv: Cv) => void) => {
  const script = document.createElement('script');
  script.src = path
  script.async = true;
  script.onload = () => {
    const cv: Cv = (window as any).cv
    cv.onRuntimeInitialized = () => callback(cv)
  };
  document.body.appendChild(script);
}
