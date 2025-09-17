import React, { FunctionComponent, useEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material';
import { AudioVolumeMeterService } from './AudioVolumeMeterService';

type VolumeBarOrientation = 'horizontal' | 'vertical';

interface AudioVolumeMeterClasses {
  root: string;
  canvas: string;
}

interface Props {
  audioDeviceId: string;
  borderRadius?: number;
  borderWidth?: number;
  className?: string;
  classes?: Partial<AudioVolumeMeterClasses>;
  height: string | number;
  maxVolume?: number;
  optimalVolume?: number;
  orientation: VolumeBarOrientation;
  width: string | number;
}

const useStyles = makeStyles<Pick<Props, 'borderRadius' | 'borderWidth' | 'height' | 'width'>>()(
  (theme, { borderRadius, borderWidth, height, width }) => ({
    root: {
      height,
      position: 'relative',
      width,
    },
    canvas: {
      background: 'rgba(255,255,255,0.9)',
      border: `${borderWidth}px solid ${lighten(theme.palette.primary.light, 0.8)}`,
      borderRadius,
      bottom: 0,
      height: '100%',
      left: 0,
      margin: 'auto',
      overflow: 'auto',
      position: 'absolute',
      right: 0,
      top: 0,
      width: '100%',
    },
  }),
);

const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const updateCanvas = (
  ctx: CanvasRenderingContext2D,
  volume: number,
  orientation: VolumeBarOrientation,
  maxVolume: number,
  optimalVolume: number,
) => {
  let ratio = volume / maxVolume;
  if (ratio > 1) ratio = 1;

  const optimalRatio = optimalVolume / 100;
  const fillWidth = orientation === 'horizontal' ? ratio * ctx.canvas.width : ctx.canvas.width;
  const fillHeight = orientation === 'vertical' ? -(ratio * ctx.canvas.height) : ctx.canvas.height;
  const y = orientation === 'horizontal' ? 0 : ctx.canvas.height;
  const hueMultiplier = ratio <= optimalRatio ? (ratio * 100) / optimalRatio : ((1 - ratio) * 100) / optimalRatio;

  clearCanvas(ctx);

  ctx.fillStyle = `hsl(${hueMultiplier}, 100%, 30%)`;
  ctx.fillRect(0, y, fillWidth, fillHeight);
};

export const AudioVolumeMeter: FunctionComponent<Props> = ({
  audioDeviceId,
  borderRadius,
  borderWidth,
  className,
  classes: cls,
  height,
  maxVolume,
  optimalVolume,
  orientation,
  width,
}: Props) => {
  const { classes, cx } = useStyles({ borderRadius, borderWidth, height, width });
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let audioVolumeMeterService: AudioVolumeMeterService | null;
    const ctx = canvas.current?.getContext('2d');

    if (ctx) {
      audioVolumeMeterService = new AudioVolumeMeterService(audioDeviceId, (volume) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        updateCanvas(ctx, volume, orientation, maxVolume!, optimalVolume!);
      });

      // noinspection JSIgnoredPromiseFromCall
      audioVolumeMeterService.start();
    }

    return () => {
      audioVolumeMeterService?.stop();
      audioVolumeMeterService = null;
    };
  }, [audioDeviceId, maxVolume, optimalVolume, orientation]);

  return (
    <div className={cx(classes.root, className, cls?.root)}>
      <canvas ref={canvas} className={cx(classes.canvas, cls?.canvas)} />
    </div>
  );
};

AudioVolumeMeter.defaultProps = {
  borderRadius: 0,
  borderWidth: 1,
  className: '',
  classes: {},
  maxVolume: 100,
  optimalVolume: 50,
};
