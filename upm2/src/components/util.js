
// react工具，存ref
const saveRef = (instance, name) => {
  return (node) => {
    instance[name] = node;
  };
};

export {
  saveRef,
};
