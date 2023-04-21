// 控制全局loading的plugin，类似于dva-loading

import _ from 'lodash';

export default (config = {}) => {


  const onEffect = (effect, { put }, model, actionType) => {

    const { namespace } = model;
    // 不对loading这个model进行包装
    if (namespace === 'loading') {
      return effect;
    }

    const [ , effectName ] = _.split(actionType, '/');

    return function *(...args) {

      const [ action ] = args;
      const { loading } = action;

      /*
      action: {
        type: 'namespace/effectName',
        payload: { key: value },
        loading: true | string,
      }
      */
      if (!loading) {
        yield effect(...args);
      }
      // 如果该effect开启了loading，则在前后包裹一下loading/start|end
      else {
        const loadingField = _.isString(loading) ? loading : effectName;

        yield put({
          type: 'loading/start',
          payload: {
            [namespace]: loadingField,
          },
        });

        // 原effect
        yield effect(...args);

        yield put({
          type: 'loading/end',
          payload: {
            [namespace]: loadingField,
          },
        });
      }
    };

  };

  return {
    onEffect,
  };
};
