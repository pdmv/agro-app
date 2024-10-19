import moment from "moment";
import 'moment/locale/vi';

moment.locale('vi');

export const formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY');
};

export const formatDateTime = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
};

export const fromNow = (dateString) => {
  return moment(dateString).fromNow();
};