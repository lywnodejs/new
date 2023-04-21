module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'upm2-webhook',
      script: 'index.js',
      exec_interpreter: 'node',
      exec_mode: 'fork_mode',
      env: {},
    }
  ]
};
