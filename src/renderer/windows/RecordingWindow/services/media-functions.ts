export type ReplaceMediaTrackFunction = (newTrack: MediaStreamTrack) => void;

export const createChangeableStreamCanvas = async (initialStream: MediaStream) => {
  let srcStream = initialStream;
  const canvas = document.createElement('canvas');

  const stream = canvas.captureStream();
  const canvasCtx = canvas.getContext('bitmaprenderer');
  const initialVideoTrack = initialStream.getVideoTracks()[0];

  let capture = new ImageCapture(initialVideoTrack);

  let settings = initialVideoTrack.getSettings();
  if (!canvasCtx) throw new Error('Canvas context failed!');
  if (!settings.width || !settings.height) throw new Error('incorrect video dimensions!');
  canvas.width = settings.width;
  canvas.height = settings.height;

  setInterval(() => {
    capture
      .grabFrame()
      .then((bitmap) => {
        canvasCtx.transferFromImageBitmap(bitmap);
      })
      .catch(() => {});
  }, 1000 / (settings.frameRate ?? 60));

  return {
    stream,
    replaceVideoTrack(newTrack: MediaStreamTrack) {
      const tracks = srcStream.getTracks();
      const newStream = new MediaStream(tracks.map((track) => (track.kind === 'video' ? newTrack : track)));
      settings = newTrack.getSettings();
      capture = new ImageCapture(newTrack);
      canvas.width = settings.width || 0;
      canvas.height = settings.height || 0;
      srcStream = newStream;
    },
  };
};
