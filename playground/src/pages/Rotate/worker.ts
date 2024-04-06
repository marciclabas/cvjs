import cv from 'opencv-ts'
import { onMessage } from 'opencv-tools/workers/rotate'

onmessage = onMessage(cv, console.debug.bind(console))