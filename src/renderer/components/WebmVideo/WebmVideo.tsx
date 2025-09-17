import React, { DetailedHTMLProps, FunctionComponent, useEffect, useRef, useState, VideoHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> & {
  duration: number;
};

export const WebmVideo: FunctionComponent<Props> = ({ duration, ...props }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [durationReset, setDurationReset] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && !durationReset) {
      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = duration;
      };

      videoElement.ondurationchange = () => {
        videoElement.currentTime = 0;
        setDurationReset(true);
      };
    }
  }, [duration, durationReset, videoRef]);

  return <video ref={videoRef} {...props} />;
};
