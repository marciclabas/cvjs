import { Either } from '@haskellian/either'

export type NotAvailable = { name: 'NotAvailable' }
export type NotFound = DOMException & { name: 'NotFoundError' };
export type NotAllowed = DOMException & { name: 'NotAllowedError' };
export type NotReadable = DOMException & { name: 'NotReadableError' };
export type Overconstrained = DOMException & { name: 'OverconstrainedError' };
export type OtherError = { name: 'other', detail: string }

export type MediaError = NotAvailable | NotFound | NotAllowed | NotReadable | Overconstrained | OtherError;

export async function safeGetMedia(constraints?: MediaStreamConstraints): Promise<Either<MediaError, MediaStream>> {
  if (!navigator.mediaDevices)
    return { tag: 'left', value: { name: 'NotAvailable' } }
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { tag: 'right', value: stream };
  } catch (e) {
    if (e instanceof DOMException) {
      switch (e.name) {
        case 'NotFoundError':
        case 'NotAllowedError':
        case 'NotReadableError':
        case 'OverconstrainedError':
          return { tag: 'left', value: { ...e, name: e.name }};
      }
    }
    return { tag: 'left', value: { name: 'other', detail: JSON.stringify(e) } }
  }
}
