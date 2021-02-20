const getMeetingId = () => {
  let id = Math.floor(100000 + Math.random() * 900000);
  return id;
}

module.exports = {
  getMeetingId,
}