const debounce = (func, time, isDebounce, ctx) => {
    let timer, lastCall, rtn;

    //  防抖函数
    if (isDebounce) {
        rtn = (...params) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(ctx, params);
            }, time);
        };
    } else {

        //  节流函数
        rtn = (...params) => {
            const now = new Date().getTime();
            if (now - lastCall < time && lastCall) return;
            lastCall = now;
            func.apply(ctx, params);
        };
    }
    return rtn;
};

export default {
    name: 'throttleDebounce',
    abstract: true,
    props: {
        time: {
            type: Number,
            default: 800
        },
        events: {
            type: String,
            default: 'click'
        },
        isDebounce: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.eventKeys = this.events.split(',');
        this.originMap = {};
        this.debouncedMap = {};
    },
    render() {
        const vnode = this.$slots.default[0];
        this.eventKeys.forEach(key => {
            const target = vnode.data.on[key];
            if (target === this.originMap[key] && this.debouncedMap[key]) {
                vnode.data.on[key] = this.debouncedMap[key];
            } else if (target) {
                this.originMap[key] = target;
                this.debouncedMap[key] = debounce(
                    target,
                    this.time,
                    this.isDebounce,
                    vnode
                );
                vnode.data.on[key] = this.debouncedMap[key];
            }
        });
        return vnode;
    }
};
