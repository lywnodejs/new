export default {
  '/staff': {
    target: 'https://mock.xiaojukeji.com/mock/5519',
    // target:
    // 'http://api-kylin-xg02.intra.xiaojukeji.com/wujie_cxyx_staff_test_test',
    changeOrigin: true,
    pathRewrite: { '^/staff': '/staff' },
  },
};
