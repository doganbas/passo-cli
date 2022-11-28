function removeOptionsFromArgs(args, argsWithValues = []) {
  const temp = [];

  if (args.length > 0) {
    args.reduce((previous, current) => {
      if (current.charAt(0) !== '-' && !argsWithValues.includes(previous)) {
        temp.push(current);
      }

      return current;
    }, '');
  }

  return temp;
}

module.exports = removeOptionsFromArgs;
