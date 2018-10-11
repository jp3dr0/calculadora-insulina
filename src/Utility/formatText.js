import { MaskService } from "react-native-masked-text";

export const formatToMoney = number => {
  MaskService.toMask("money", number, {
    /*
    unit: 'US$',
    separator: '.',
    delimiter: ','
    */
  });
};

export const weekdayFromDateString = str => {
  const weekStringPtBr = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ];
  const weekStringEnglish = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const partes = str.split("/").map(Number);
  const data = new Date(partes[2], partes[1] - 1, partes[0]);
  //return data.toLocaleString([], { weekday: "long" });
  const weekdayEnglish = data
    .toUTCString()
    .toString()
    .slice(0, 3);
  //weekdayEnglish = weekdayEnglish[0] + weekdayEnglish[1] + weekdayEnglish[2];
  //return (weekdayEnglish === weekStringEnglish[2]).toString();

  for (let index = 0; index < weekStringEnglish.length; index++) {
    const element = weekStringEnglish[index];
    if (element === weekdayEnglish) {
      return weekStringPtBr[index];
    }
  }

  return "";
};

export const formatToShortTime = time =>
  time
    ? MaskService.toMask("datetime", time, {
        format: "HH:mm"
      })
    : null;

export const formatDateToServer = (date, monthIncrease) => {
  if (typeof date === "object") {
    let mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    if (monthIncrease) mm += monthIncrease;

    return [
      date.getFullYear(),
      (mm > 9 ? "" : "0") + mm,
      (dd > 9 ? "" : "0") + dd
    ].join("-");
  } else {
    return MaskService.toMask("datetime", date, {
      format: "YYYY-MM-DD"
    });
  }
};

const parseDateToArray = date => {
  const separator = date.indexOf("/") != -1 ? "/" : "-";
  //console.log(separator);
  //console.log(date);
  const masked = MaskService.toMask("datetime", date);
  console.log(masked);
  return masked.split("/");
};
export const formatToLongDate = (date, separator) => {
  //console.log(date, separator);
  const space = separator ? separator : "/";
  if (typeof date === "object") {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    const value = [
      (dd > 9 ? "" : "0") + dd,
      (mm > 9 ? "" : "0") + mm,
      date.getFullYear()
    ].join(space);
    //console.log(value);
    return value;
  } else {
    const array = parseDateToArray(date);
    console.log(array);
    return array[2] + space + array[1] + space + array[0];
  }
};

export const formatToShortDate = date => {
  //console.log(date);
  let array = parseDateToArray(date);
  //console.log(array);
  return array[2] + "/" + array[1];
};

////////////////

export const parseDateFromServerToMasked = (date, hideYear) => {
  let parsedDate = date
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");

  if (hideYear) parsedDate = parsedDate.slice(0, -5);

  return parsedDate;
};

export const parseTimeFromServerToMasked = date => date.split("T")[1];
//.slicd(0,-3)

export const parseDateTimeFromServerToMasked = (date, separator) =>
  parseDateFromServerToMasked(date) +
  (separator ? " " + separator + " " : " ") +
  parseTimeFromServerToMasked(date);
