import _ from "lodash";

const findTreeNodeById = (list, id) => {

  let result = undefined;

  _.each(list, node => {
    if (node.id == id) {
      result = node;
      return false;
    }
    let child = findTreeNodeById(node.children, id);
    if (child) {
      result = child;
      return false;
    }

  });

  return result;
};

export default findTreeNodeById;
