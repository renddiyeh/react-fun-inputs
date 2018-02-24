export default (function (str) {
  if (str.slice(-1) === '%') {
    return parseFloat(str) / 100;
  }
  return 1;
});