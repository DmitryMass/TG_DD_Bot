const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0'); // получаем день месяца и добавляем ведущий ноль, если нужно
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // получаем месяц (начиная с 0) и добавляем ведущий ноль, если нужно
  const year = date.getFullYear().toString(); // получаем год
  const hours = date.getHours().toString().padStart(2, '0'); // получаем часы и добавляем ведущий ноль, если нужно
  const minutes = date.getMinutes().toString().padStart(2, '0'); // получаем минуты и добавляем ведущий ноль, если нужно
  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`; // формируем строку с обычным форматом даты

  return formattedDate;
};

export default formatDate;
