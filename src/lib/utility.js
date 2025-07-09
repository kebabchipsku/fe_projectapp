export const getCurrrentDate = (dateToFormat = new Date()) => {
  const date = Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date.format(dateToFormat);
};
