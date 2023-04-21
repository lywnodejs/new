module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'upm2-dev',
      script: './node_modules/.bin/roadhog',
      args: 'server',
      exec_interpreter: 'node',
      exec_mode: 'fork_mode',
      env: {
        NODE_ENV: 'prerelease',
        PORT: 8001,
      },
    }
  ]
};
