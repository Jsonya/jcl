function isEmail(value) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^([\w]+([\w-\.+]*[\w-]+)?)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;
  return reg.test(value);
}

module.exports = {
  isEmail,
};
