function throttle(func, wait) {

    // func()

    let previous = 0;
    return function() {
        let now = Date.now();

        let context = this;

        let args = arguments;
        if (now - previous > wait) {

            func.apply(context, args);

            // func()
            previous = now;
        }
    }
}
export default throttle
