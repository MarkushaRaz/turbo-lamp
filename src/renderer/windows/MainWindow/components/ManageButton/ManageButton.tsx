import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { keyframes } from 'tss-react';
import { useTranslation } from 'react-i18next';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AktruIcon, AppRegion } from '_renderer/components';

interface Props {
  onClick?(): void;
  showWarning?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    '& *': {
      transition: 'all 200ms ease-out',
      opacity: 0.9,
    },
    '&:hover *': {
      opacity: 1,
    },
  },
  aktruIcon: {
    height: 35,
    width: 90,
    marginBottom: 10,
  },
  warningIcon: {
    animation: `${keyframes`
      0% {
        opacity: 0;
      }
      49% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    `} 1s infinite linear`,
    color: 'red',
    left: 37,
    position: 'absolute',
    top: -3,
  },
  button: {
    background: theme.palette.primary.main,
    borderRadius: 10,
    color: 'white',
    fontSize: 11,
    padding: '3px 10px',
    textTransform: 'uppercase',
  },
}));

export const ManageButton: FunctionComponent<Props> = ({ onClick, showWarning }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <AppRegion className={classes.root}>
      <button
        type='button'
        title={t<string>('window.main.manageButton.title')}
        className={classes.buttonContainer}
        onClick={onClick}
      >
        <AktruIcon variant='full' className={classes.aktruIcon} />
        <div className={classes.button}>{t('window.main.manageButton.text')}</div>
      </button>
      {showWarning && <PriorityHighIcon className={classes.warningIcon} fontSize='small' />}
    </AppRegion>
  );
};

ManageButton.defaultProps = {
  onClick: undefined,
  showWarning: false,
};
