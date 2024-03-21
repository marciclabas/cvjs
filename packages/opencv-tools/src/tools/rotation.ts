import { Mat } from "opencv-ts";
import { Cv } from "use-cv";

export type Rotation = 90 | 180 | -90

/** Rotate an image by a multiple of 90 degrees.
 * - Uses `cv.transpose` and/or `cv.flip`
 */
export function rotate(img: Mat, rotation: Rotation, cv: Cv): Mat {
    const dst = new cv.Mat();
    switch (rotation) {
        case 90:
            cv.transpose(img, dst);
            cv.flip(dst, dst, 1); // 1 = flip horizontally
            return dst;
        case -90:
            cv.transpose(img, dst);
            cv.flip(dst, dst, 0); // 0 = flip vertically
            return dst;
        case 180:
            cv.flip(img, dst, -1); // -1 = flip both horizontally and vertically
            return dst;
    }
}