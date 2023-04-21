const hasOwnProperty = Object.prototype.hasOwnProperty;

export class EventEmitter {
  /**
   * 事件对象池
   *  - key值为事件名称
   *  - value 值为事件的监听函数队列
   */
  private $events: Record<string, Function[]> = {};

  /**
   * 添加监听事件
   * @param event 事件名称
   * @param fnc 回调函数
   */
  public on(event: string, fnc: Function) {
    if (!hasOwnProperty.call(this.$events, event)) {
      this.$events[event] = [];
    }
    this.$events[event].push(fnc);

    // 返回该监听事件的取消函数，方便调用方取消监听
    return () => {
      this.off(event, fnc);
    };
  }

  /**
   * 取消对指定事件的监听
   * @param event 事件名称
   * @param fnc 回调函数，可选，如果有值则取消该事件，如果没值则取消全部该事件类型的回调函数
   */
  public off(event: string, fnc?: Function) {
    if (!hasOwnProperty.call(this.$events, event)) {
      return;
    }
    if (fnc) {
      this.$events[event] = this.$events[event].filter(item => item !== fnc);
    } else {
      this.$events[event] = [];
    }
    // 如果指定事件的监听函数列表为空，则删除该事件，节省内存空间
    if (this.$events[event].length === 0) {
      delete this.$events[event];
    }
  }

  /**
   * 触发指定事件，该事件中的所有回调都会执行
   * @param event 事件名称
   * @param args 事件参数，作为回调函数的参数列表
   */
  public emit(event: string, ...args) {
    if (hasOwnProperty.call(this.$events, event)) {
      // 这里之所以用 slice() 是为了防止在执行过程中有新的事件监听被插进来导致意外的情况
      this.$events[event].slice().forEach(fnc => {
        fnc.call(null, ...args);
      });
    }
  }

  /**
   * 销毁事件发射器
   */
  public dispose() {
    Object.keys(this.$events).forEach(event => {
      this.off(event);
    });
  }
}
