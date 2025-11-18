import dayjs from 'dayjs';

export const formatDateString = (date: string, format: string = 'MMM D, YYYY') => {
  const formattedDate = dayjs(date).format(format);

  return formattedDate;
};
