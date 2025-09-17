import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { Drawer as MuiDrawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DrawerItem } from '../types';

const width = 230;

interface Props {
  items: DrawerItem[];
}

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
  },
  hasError: {
    color: theme.palette.error.main,
  },
  paper: {
    position: 'static',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 0.5),
  },
}));

export const Drawer: FunctionComponent<Props> = ({ items }: Props) => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [shouldOpen, setShouldOpen] = useState(false);

  const closeDrawer = () => {
    setShouldOpen(false);
    setOpen(false);
  };

  const openDrawerWithDelay = () => {
    setShouldOpen(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (shouldOpen) {
      timeout = setTimeout(() => setOpen(true), 1500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [shouldOpen]);

  return (
    <MuiDrawer
      variant='permanent'
      className={cx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: cx(classes.paper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      onMouseEnter={openDrawerWithDelay}
      onMouseLeave={closeDrawer}
    >
      <List>
        {items.map(({ route, text, icon: Icon, hasError }) => (
          <ListItemButton key={route} onClick={() => navigate(route)} selected={location.pathname === route}>
            <ListItemIcon>
              <Icon className={cx({ [classes.hasError]: hasError })} />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
};
