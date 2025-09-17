import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import { AppRegion } from '_renderer/components';

interface Props {
  enabled: boolean;
  onClick?(): void;
  padding?: number;
}

const useStyles = makeStyles<Pick<Props, 'padding'>>()((_, { padding }) => ({
  root: {
    aspectRatio: '1/1',
    height: '100%',
    padding,
  },
  button: {
    background: 'radial-gradient(ellipse at center, #a90303 0%, #8f0202 80%, #6d0000 100%)',
    borderColor: '#821313',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 4,
    height: '100%',
    opacity: 0.5,
    pointerEvents: 'none',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
  },
  enabled: {
    boxShadow: '0 0 5px 3px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    opacity: 1,
    pointerEvents: 'auto',
    '&:hover': {
      background: 'radial-gradient(ellipse at center, #c10303 0%, #a80303 80%, #800101 100%)',
      transform: 'scale(1.025)',
    },
  },
}));

export const RecordButton: FunctionComponent<Props> = ({ enabled, padding, onClick }: Props) => {
  const { classes, cx } = useStyles({ padding });
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <AppRegion
        aria-label={t<string>('window.main.recordButton.title')}
        className={cx(classes.button, { [classes.enabled]: enabled })}
        component='button'
        onClick={onClick}
        title={t<string>('window.main.recordButton.title')}
        type='button'
      />
    </div>
  );
};

RecordButton.defaultProps = {
  onClick: undefined,
  padding: 12,
};
