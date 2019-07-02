export default (s: string) => {
  return s.replace(/(-\w)/g, function(m) {
    return m[1].toUpperCase();
  });
};
