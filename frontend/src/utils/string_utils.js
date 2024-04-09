export const prettyPhone = (phone) => {
    return `${phone.slice(0, -10)} (${phone.slice(-10, -7)}) ${phone.slice(
      -7,
      -4
    )}-${phone.slice(-4, -2)}-${phone.slice(-2)}`;
  };