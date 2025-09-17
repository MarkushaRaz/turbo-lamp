import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  duration: number;
}

const FORMAT = 'HH:mm:ss';

export const EntryDuration: FunctionComponent<Props> = ({ duration }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <b>{t('general.duration')}: </b>
      {moment.duration(duration, 'seconds').format(FORMAT, { trim: false })}
    </>
  );
};
