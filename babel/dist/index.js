import _Promise from "babel-runtime/core-js/promise";
import _asyncToGenerator from "babel-runtime/helpers/asyncToGenerator";
import _Object$assign from "babel-runtime/core-js/object/assign";
import _Array$from from "babel-runtime/core-js/array/from";
let [a, b, c] = [0, 1, 2];

let d = (...arr) => {
    console.log(arr);
};
d([a, b, c]);

var fromArr = _Array$from([1, 2, 3]);

_Object$assign({});

_asyncToGenerator(function* () {

    yield new _Promise();
});

class Test {

    constructor() {}

    log() {
        console.log(Test.name);
    }
}
new Test().log();
