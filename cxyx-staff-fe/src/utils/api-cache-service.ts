const hasOwnProperty = Object.prototype.hasOwnProperty;

const DefaultGenerateKey = (o: any) => {
  return JSON.stringify(o);
};

/**
 * 接口请求缓存服务
 *
 * 缓存声明周期:
 * 1、刷新即失效，在整个应用运行周期内都有效
 * 2、TODO: 自定义失效策略，比如可以手动清除、定时清除、指定条件清除等
 *
 * 适用场景:
 * 在多个 页面/组件 都需要使用同一份数据（例如城市列表），目前的做法是每个模块会单独请求接口
 * 但是对于相对稳定的数据我们可以直接将数据缓存，后续相同的请求可以直接返回数据而不需要从接口返回
 *
 * 要求:
 * 1、接口需要是幂等的（一般是GET方法的接口，但 是否幂等可能需要人为介入判断，比如 traceId 可以忽略，接口请求时间(datetime)可以根据是否需要被使用来决定）
 * 2、接口数据是相对稳定的（比如开城城市、全国城市之类的）
 */
export class ApiCacheService<T> {
  /**
   * 所有缓存实例
   */
  public static instances: ApiCacheService<any>[] = [];

  /**
   * 销毁全部缓存实例
   */
  public static destroyAll() {
    const instances = ApiCacheService.instances.slice();
    instances.forEach(instance => {
      instance.destroy();
    });
  }

  private $caches: { [key: string]: Promise<T> } = {};

  constructor(
    /**
     * 接口请求方法
     */
    private $fetch: (...p: any[]) => Promise<T>,
    /**
     * 缓存 key 值的计算逻辑
     */
    private $generateKey: (...p: any[]) => string = DefaultGenerateKey,
  ) {
    ApiCacheService.instances.push(this);
  }

  public fetch(...params) {
    const key = this.$generateKey(...params);

    // 优先命中缓存
    if (hasOwnProperty.call(this.$caches, key)) {
      return this.$caches[key];
    }
    this.$caches[key] = this.$fetch(...params).catch(error => {
      // 失败的请求不应该被缓存
      this.remove(key);
      throw error;
    });

    return this.$caches[key];
  }

  /**
   * 删除指定缓存
   * @param key
   */
  public remove(key: string) {
    if (hasOwnProperty.call(this.$caches, key)) {
      delete this.$caches[key];
    }
  }

  /**
   * 删除全部缓存
   */
  public clear() {
    Object.keys(this.$caches).forEach(key => {
      this.remove(key);
    });
  }

  /**
   * 销毁缓存实例
   */
  public destroy() {
    this.clear();
    const index = ApiCacheService.instances.indexOf(this);
    if (index > -1) {
      ApiCacheService.instances.slice(index, 1);
    }
  }
}
