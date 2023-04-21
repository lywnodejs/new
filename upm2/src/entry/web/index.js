import dva from 'dva';
// import createBrowserHistory from 'history/createBrowserHistory';

// fix warning
// Please use `require("history").createBrowserHistory` instead of `require("history/createBrowserHistory")`
import { createBrowserHistory } from 'history';
import { message } from 'antd';
import each from 'lodash/each';

import models from '../../models';
import routes from './routes';
import loading from '../../plugins/loading';

import 'intro.js/introjs.css';
import '@style/web.less';

import '../../themes/echarts';
import '../../styles/index.less';

// 1. Initialize
const app = dva({
  history: createBrowserHistory(),
  // TODO 优化提示
  onError(error) {
    console.error(error); // eslint-disable-line
    message.destroy();
    message.error(error.message, 5);
  },
});

// 2. Plugins
app.use(loading());

// 3. Model
each(models, (m) => {
  app.model(m);
});

// 4. Router
app.router(routes);

// 5. Start
app.start('#root');
