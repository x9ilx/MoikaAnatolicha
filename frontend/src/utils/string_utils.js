export const prettyPhone = (phone) => {
  if (phone) {
    if (phone.length === 0) {
      return "не указан";
    }
    return `${phone.slice(0, -10)} (${phone.slice(-10, -7)}) ${phone.slice(
      -7,
      -4
    )}-${phone.slice(-4, -2)}-${phone.slice(-2)}`;
  }
};
