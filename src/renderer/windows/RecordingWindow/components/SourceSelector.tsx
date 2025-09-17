/* eslint-disable react/jsx-props-no-spreading */

import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CaptureSource } from '_/shared/types';

export interface SourceSelectProps {
  onChangeSelectedSource(source?: CaptureSource): void;
  onOpen?(): void;
  selectedSource?: CaptureSource;
  sources: CaptureSource[];
}

const useStyles = makeStyles()((theme) => ({
  wrapper: {
    width: '90%',
    margin: '5px auto',
    display: 'block',
  },
  select: {
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.grey['900']}`,
    margin: '0 0 5px 0',
    padding: '0 5px',
    width: '100%',
    '& MenuItem': {
      'min-height': 'auto',
    },
  },
}));

export const SourceSelector: FunctionComponent<SourceSelectProps> = ({
  onChangeSelectedSource,
  onOpen,
  selectedSource,
  sources,
}: SourceSelectProps) => {
  const { classes } = useStyles();

  const handleSelectedSourceChange = (event: SelectChangeEvent<string>) => {
    const filtered = sources.filter((src) => src.deviceId === event.target.value);
    onChangeSelectedSource(filtered[0]);
  };

  return (
    <FormControl className={classes.wrapper} variant='standard' sx={{ m: 1, minWidth: 120 }}>
      <Select
        className={classes.select}
        onChange={handleSelectedSourceChange}
        value={selectedSource?.deviceId ?? ''}
        variant='standard'
        onOpen={onOpen}
      >
        {sources?.map((source) => {
          return (
            <MenuItem value={source.deviceId} key={source.deviceId}>
              {source.deviceName}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

SourceSelector.defaultProps = {
  onOpen: undefined,
  selectedSource: undefined,
};
