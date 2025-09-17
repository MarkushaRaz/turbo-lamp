import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  date: Date;
}

const FORMAT = 'DD.MM.YYYY HH:mm:ss';

export const EntryDate: FunctionComponent<Props> = ({ date }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <b>{t('general.date')}: </b>
      {moment(date).format(FORMAT)}
    </>
  );
};
