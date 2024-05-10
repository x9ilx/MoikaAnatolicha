export function timer(startDate, endDate) {
    let delta = Math.floor((endDate - startDate) / 1000);
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;
    return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
      "0" + seconds
    ).slice(-2)}`;
  }