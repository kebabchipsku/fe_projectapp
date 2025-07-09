export const getCurrrentDate = () => {
  const date = Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const currentDate = new Date();
  return date.format(currentDate);
};
