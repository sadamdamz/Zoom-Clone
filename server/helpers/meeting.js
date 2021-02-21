const getMeetingId = () => {
  let id = Math.floor(100000 + Math.random() * 90000000);
  return id;
}

module.exports = {
  getMeetingId,
}