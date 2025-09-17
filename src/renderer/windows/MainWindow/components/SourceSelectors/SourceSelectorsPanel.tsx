import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useEntitlement } from '_renderer/hooks';
import { PropsWithChildren } from '_renderer/types';
import { Entitlement } from '_shared/enums';

interface StylesProps {
  hasSystemSoundToggle: boolean;
}

const useStyles = makeStyles<StylesProps>()((_, { hasSystemSoundToggle }) => ({
  root: {
    height: '100%',
    width: hasSystemSoundToggle ? 330 : 258,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}));

export const SourceSelectorsPanel: FunctionComponent<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const hasSystemSoundToggle = useEntitlement(Entitlement.HasSystemAudioToggle);
  const { classes } = useStyles({ hasSystemSoundToggle });
  return <div className={classes.root}>{children}</div>;
};
