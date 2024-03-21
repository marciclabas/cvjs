import { Vec2, dist } from '../util/vectors.js'
import { flatten } from '../util/flatten.js'
import { Mat } from 'opencv-ts'
import { Cv } from 'use-cv'

export type Corners = {
    tl: Vec2, tr: Vec2, br: Vec2, bl: Vec2
  }

export type Paddings = {
  left: number, right: number, top: number, bottom: number
}

/** Correct `img` by morphing `corners` into a rectangle
 * - `pads`: absolute pixels of padding to add around the result
 */
export function correct(img: Mat, corners: Corners, cv: Cv, pads?: Partial<Paddings>): Mat {
  const { width, height } = img.size();
  const { tl, tr, br, bl } = corners;

  const srcPts = [tl, tr, br, bl]
    .map(([x, y]) => [x*width, y*height])

  const w = width*(dist(tl, tr) + dist(bl, br)) / 2;
  const h = height*(dist(tl, bl) + dist(tr, br)) / 2;

  const padLeft = pads?.left ?? (w * 0.02);
  const padRight = pads?.right ?? (w * 0.02);
  const padTop = pads?.top ?? (h * 0.02);
  const padBottom = pads?.bottom ?? (h * 0.02);
  
  const dstPts = [[0, 0], [w, 0], [w, h], [0, h]]
    .map(([x, y]) => [x + padLeft, y + padTop])

  const M = cv.getPerspectiveTransform(
    cv.matFromArray(4, 1, cv.CV_32FC2, flatten(srcPts)),
    cv.matFromArray(4, 1, cv.CV_32FC2, flatten(dstPts))
  );
  const dsize = new cv.Size(w + padLeft + padRight, h + padTop + padBottom);
  const dst = new cv.Mat();
  cv.warpPerspective(img, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
  return dst;
}