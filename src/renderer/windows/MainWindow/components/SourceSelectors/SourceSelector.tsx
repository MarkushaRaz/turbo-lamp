import React, { ChangeEvent, FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  SvgIconComponent,
} from '@mui/icons-material';
import { ClickAwayListener, Grow, lighten, NativeSelect, Popper, Skeleton, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Property } from 'csstype';
import { AppRegion } from '_renderer/components';
import { CaptureSource, DesktopCaptureConstraints } from '_/shared/types';

export interface SourceSelectProps {
  children?: ReactNode;
  constraints?: MediaStreamConstraints | DesktopCaptureConstraints;
  dropdownText: string;
  enabled: boolean;
  enableVideoPreview: boolean;
  sourceEnabled: boolean;
  mirrored?: boolean;
  onChangeSelectedSource(source?: CaptureSource): void;
  onToggleDropdown(): void;
  onToggleSourceStatus(): void;
  removeDropdownBottomPadding?: boolean;
  selectedSource?: CaptureSource;
  sourceDisabledIcon: SvgIconComponent;
  sourceEnabledIcon: SvgIconComponent;
  sources: CaptureSource[];
  toggleTitle: string;
}

function statusToColor(sourceEnabled: boolean, hasSourceData: boolean, theme: Theme): Property.Color {
  if (sourceEnabled && hasSourceData) return theme.palette.primary.main;
  if (sourceEnabled && !hasSourceData) return theme.palette.error.dark;
  return lighten(theme.palette.primary.light, 0.2);
}

const useStyles = makeStyles<
  Pick<
    SourceSelectProps,
    'enableVideoPreview' | 'enabled' | 'mirrored' | 'removeDropdownBottomPadding' | 'selectedSource' | 'sourceEnabled'
  >
>()((theme, { enableVideoPreview, enabled, mirrored, removeDropdownBottomPadding, selectedSource, sourceEnabled }) => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '85%',
    justifyContent: 'space-around',
    maxWidth: 60,
  },
  icon: {
    color: statusToColor(sourceEnabled, !!selectedSource, theme),
    cursor: enabled ? 'pointer' : 'default',
    fontSize: 48,
    marginBottom: -5,
    opacity: enabled ? 0.85 : 0.5,
    '&:hover': {
      opacity: enabled ? 1 : 0.5,
    },
  },
  captionContainer: {
    position: 'relative',
    marginTop: -2,
  },
  caption: {
    cursor: enabled ? 'pointer' : 'default',
    display: 'inline-block',
    lineHeight: 1.1,
    minHeight: 24,
    position: 'relative',
    textAlign: 'center',
  },
  chevron: {
    position: 'absolute',
    visibility: enabled ? 'visible' : 'hidden',
  },
  dropdown: {
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: 3,
    boxShadow: '0 0 6px 0px rgba(0,0,0,0.3)',
    height: 'auto',
    padding: removeDropdownBottomPadding ? '10px 10px 0' : '10px',
    position: 'relative',
    top: 5,
    width: '280px',
    '&:after, &:before': {
      border: 'solid transparent',
      bottom: '100%',
      content: '""',
      height: 0,
      left: '50%',
      pointerEvents: 'none',
      position: 'absolute',
      width: 0,
    },
    '&:after': {
      borderBottomColor: 'white',
      borderWidth: '8px',
      marginLeft: '-8px',
    },
    '&:before': {
      borderBottomColor: theme.palette.primary.light,
      borderWidth: '9px',
      marginLeft: '-9px',
    },
  },
  videoContainer: {
    position: 'relative',
  },
  video: {
    aspectRatio: '1.79',
    border: `1px solid ${theme.palette.grey['900']}`,
    height: 'auto',
    objectFit: 'cover',
    transform: mirrored ? 'rotateY(180deg)' : 'none',
    width: '100%',
  },
  skeleton: {
    aspectRatio: '1.79',
    width: '100%',
    height: 'auto',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontSize: '15px',
  },
  select: {
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.grey['900']}`,
    marginTop: theme.spacing(enableVideoPreview ? 0.5 : 0),
    padding: '0 5px',
    width: '100%',
    '& select': {
      '&:focus': {
        backgroundColor: '#fff',
        borderBottom: 'none',
      },
    },
  },
}));

export const SourceSelector: FunctionComponent<SourceSelectProps> = ({
  children,
  constraints,
  dropdownText,
  enableVideoPreview,
  enabled,
  mirrored,
  onChangeSelectedSource,
  onToggleDropdown,
  onToggleSourceStatus,
  removeDropdownBottomPadding,
  selectedSource,
  sourceDisabledIcon: DisabledIcon,
  sourceEnabled,
  sourceEnabledIcon: EnabledIcon,
  sources,
  toggleTitle,
}: SourceSelectProps) => {
  const { classes } = useStyles({
    enableVideoPreview,
    enabled,
    mirrored,
    removeDropdownBottomPadding,
    selectedSource,
    sourceEnabled,
  });
  const [open, setOpen] = React.useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const prevOpen = React.useRef(open);
  const prevStream = React.useRef(stream);
  const videoRef = useRef<HTMLVideoElement>(null);
  const Icon = sourceEnabled ? EnabledIcon : DisabledIcon;
  const { t } = useTranslation();

  let iconTitle = enabled ? toggleTitle : t('window.main.sourceSelector.toggle.title.scheduledRecordingEnabled');

  if (selectedSource?.deviceName) {
    iconTitle = `${selectedSource.deviceName}\n\n${iconTitle}`;
  }

  const handleSelectedSourceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const filtered = sources.filter((src) => src.deviceId === event.target.value);
    onChangeSelectedSource(filtered[0]);
  };

  const toggleDropdown = () => {
    if (!enabled) return;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setOpen((prevOpen) => !prevOpen);
    onToggleDropdown();
  };

  const closeDropdown = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    if (open) onToggleDropdown();
    setOpen(false);
  };

  const initVideoStream = () => {
    if (!constraints) return;
    navigator.mediaDevices
      .getUserMedia(constraints as MediaStreamConstraints)
      .then((mediaStream) => setStream(mediaStream))
      .catch(() => setStream(null));
  };

  const handleIconClick = () => {
    if (!enabled) return;
    onToggleSourceStatus();
  };

  const destroyVideoStream = () => {
    setStream(null);
  };

  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    initVideoStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [constraints]);

  useEffect(() => {
    prevStream.current?.getTracks().forEach((track) => track.stop());
    prevStream.current = stream;
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (open) {
      initVideoStream();
    } else {
      destroyVideoStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <AppRegion>
      <ClickAwayListener onClickAway={closeDropdown}>
        <div className={classes.container}>
          <div title={iconTitle}>
            <Icon className={classes.icon} onClick={handleIconClick} />
          </div>
          <div onClick={toggleDropdown} className={classes.captionContainer} ref={anchorRef}>
            <Typography variant='caption' className={classes.caption}>
              {dropdownText}
              {open ? (
                <KeyboardArrowUpIcon fontSize='inherit' className={classes.chevron} />
              ) : (
                <KeyboardArrowDownIcon fontSize='inherit' className={classes.chevron} />
              )}
            </Typography>
          </div>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <div className={`${classes.dropdown}`}>
                  {enableVideoPreview && (
                    <div className={classes.videoContainer}>
                      <video ref={videoRef} className={classes.video} autoPlay muted />
                      {!stream && <Skeleton variant='rectangular' animation='wave' className={classes.skeleton} />}
                    </div>
                  )}
                  <div>
                    <NativeSelect
                      className={classes.select}
                      onChange={handleSelectedSourceChange}
                      value={selectedSource?.deviceId ?? ''}
                      variant='outlined'
                    >
                      {sources?.map((source) => {
                        return (
                          <option value={source.deviceId} key={source.deviceId}>
                            {source.deviceName}
                          </option>
                        );
                      })}
                    </NativeSelect>
                    {children}
                  </div>
                </div>
              </Grow>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </AppRegion>
  );
};

SourceSelector.defaultProps = {
  children: undefined,
  constraints: undefined,
  mirrored: false,
  removeDropdownBottomPadding: false,
  selectedSource: undefined,
};
