function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function componentNameWithoutSpecialCharacter(str) {
  return str.split('-').map(capitalizeFirstLetter).join('');
}

module.exports = {
  capitalizeFirstLetter,
  componentNameWithoutSpecialCharacter,
};
