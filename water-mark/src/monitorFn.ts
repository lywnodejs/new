export interface IMonitorFn {
    monitors: any[];
    timmer: any;
    time: number
    isStop: boolean;
    addMonitor(fn: () => void): IMonitorFn;
    done(): IMonitorFn;
    start(): IMonitorFn;
    stop(): IMonitorFn;
}

class MonitorFn implements IMonitorFn {
    monitors: any[];
    timmer: any;
    time: number
    isStop: boolean;
    constructor(time: number) {
        this.monitors = [];
        this.timmer = null;
        this.time = time || 2000;
        this.isStop = false;
    }
    addMonitor(fn: () => void) {
        this.monitors.push(fn);
        return this;
    }
    done() {
        if (this.isStop) {
            clearTimeout(this.timmer);
            return this;
        }
        this.monitors.forEach(function (fn) {
            fn();
        });
        this.timmer = setTimeout(this.done.bind(this), this.time);
        return this;
    }
    start() {
        this.timmer = setTimeout(this.done.bind(this), this.time);
        this.isStop = false;
        return this;
    }
    stop() {
        this.isStop = true;
        clearTimeout(this.timmer);
        return this;
    }
}

export default MonitorFn;
