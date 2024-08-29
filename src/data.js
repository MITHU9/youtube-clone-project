export const API_KEY = "AIzaSyACeyzK8FTN1FDp96kr4Smpwk9NfqpfXY8";

export const valueConverter = (value) => {
  if (value >= 1000000) {
    return Math.floor(value / 1000000) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
};
