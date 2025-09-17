import React, { FunctionComponent, ReactNode, useEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { NullableMediaStream } from '../types';

export interface SourceScreenProps {
  children?: ReactNode;
  mirrored?: boolean;
  stream: NullableMediaStream;
}

const useStyles = makeStyles<Pick<SourceScreenProps, 'mirrored'>>()((theme, { mirrored }) => ({
  root: {
    margin: '0 auto',
    position: 'relative',
    width: '90%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  },
  video: {
    aspectRatio: '16/9',
    objectFit: 'cover',
    outline: `1px solid ${theme.palette.grey['900']}`,
    transform: mirrored ? 'rotateY(180deg)' : 'none',
    width: '100%',
  },
}));

export const SourcePreview: FunctionComponent<SourceScreenProps> = ({
  children,
  mirrored,
  stream,
}: SourceScreenProps) => {
  const { classes } = useStyles({ mirrored });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.srcObject = stream ?? null;
    }

    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className={classes.root}>
      <video ref={videoRef} autoPlay className={classes.video} muted />
      {children}
    </div>
  );
};

SourcePreview.defaultProps = {
  children: undefined,
  mirrored: false,
};
