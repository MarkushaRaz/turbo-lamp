import { BridgeAPI } from '_/shared/services';
import { Teacher } from '_/shared/services/schedule-service/types';
import React, { Dispatch, FunctionComponent, SetStateAction, useState, useEffect, ChangeEvent } from 'react';
import { Grid } from '_renderer/components';
import {
  Button,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConferenceWindowState } from '_/shared/types';
import log from 'electron-log';
import { asError } from '_shared/utils';

const logger = log.scope('ConferenceWindow/History');

export interface HistoryProps {
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
  teacher: Teacher;
}

export class Event {
  id: string;

  name: string;

  start: string;

  end: string;

  duration: string;

  constructor(id: string, name: string, start: string, end: string, duration: string) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = end;
    this.duration = duration;
  }
}

export const History: FunctionComponent<HistoryProps> = ({ setAction, teacher }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState(new Array<Event>());
  const [pagesCount, setPagesCount] = useState(1);
  const [page, setPage] = useState(1);

  const locatTime = (data: string) => {
    const now = new Date(data);
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toLocaleString();
  };

  const getEvents = (_page: number) => {
    BridgeAPI.GetEvents(teacher.email, _page)
      .then((json) => {
        logger.info(`Get events from bridge`, json);
        const data = JSON.parse(json);
        const list: any = [];
        data.Events.forEach((event: any) => {
          logger.info(`Add ${event.ID} to event list`);
          list.push(new Event(event.ID, '', locatTime(event.Start), locatTime(event.End), event.Duration));
        });
        setEvents(list);
        setPagesCount(data.PageNavigation.TotalPages);
        setPage(data.PageNavigation.PageNumber);
      })
      .catch((e) => {
        logger.error(asError(e).message, asError(e));
      });
  };

  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    logger.info(`Open ${newPage} page`);
    getEvents(newPage);
  };

  useEffect(() => {
    getEvents(1);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ float: 'left', height: '50px', margin: '15px 15px 0 15px' }}>
        <Button
          sx={{ width: 100 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setAction({ display: 'Main' } as SetStateAction<ConferenceWindowState>);
          }}
        >
          Главная
        </Button>
        <TableContainer component={Paper} sx={{ width: 765, height: 450 }}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>{t('communication.event.start')}</TableCell>
                <TableCell align='center'>{t('communication.event.end')}</TableCell>
                <TableCell align='center'>{t('communication.event.duration')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{event.id}</TableCell>
                  <TableCell align='center'>{event.start}</TableCell>
                  <TableCell align='center'>{event.end}</TableCell>
                  <TableCell align='center'>{event.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container item padded justifyContent='center' shrink={0}>
          <Pagination
            count={pagesCount}
            defaultPage={1}
            onChange={handlePageChange}
            page={page}
            showFirstButton
            showLastButton
          />
        </Grid>
      </div>
    </div>
  );
};
