/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { makeStyles } from 'tss-react/mui';
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useRef } from 'react';

interface Props {
  id: string;
  name: string;
  stream: MediaStream;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

const useStyles = makeStyles()(() => ({
  selected: {
    borderColor: 'rgba(66, 153,232, 0.9)',
    boxShadow: 'rgba(66, 153, 232, 0.75) 0px 0px 5px',
  },
}));

export const ViewObject: FunctionComponent<Props> = ({ id, name, stream, selected, setSelected }: Props) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const { classes } = useStyles();
  useEffect(() => {
    if (!localVideo.current) return;
    localVideo.current.srcObject = stream;
  }, [stream, localVideo]);

  return (
    <li key={id} className={id === selected ? classes.selected : ''} onClick={() => setSelected(id)}>
      <video ref={localVideo} autoPlay />
      <label htmlFor={id}>{name}</label>
    </li>
  );
};
