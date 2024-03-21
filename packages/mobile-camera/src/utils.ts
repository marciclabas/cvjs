export function loadVideo(video: HTMLVideoElement, stream: MediaStream): Promise<void> {
  const loaded = new Promise<any>(r => { video.onloadedmetadata = r })
  video.srcObject = stream
  return loaded
}