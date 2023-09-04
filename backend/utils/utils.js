exports.getDate = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    this.addZero(d.getMonth() + 1) +
    "-" +
    this.addZero(d.getDate()) +
    " " +
    this.addZero(d.getHours()) +
    ":" +
    this.addZero(d.getMinutes()) +
    ":" +
    this.addZero(d.getSeconds())
  );
};

exports.addZero = (i) => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};
