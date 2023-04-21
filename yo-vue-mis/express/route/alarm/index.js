const path = require('path'),
    ROOT = require('../../Constanst').ROOT

module.exports = function (app) {
    app.get('/portals/pages/alarm-event.html', (req, rsp) => {
        rsp.sendFile(path.resolve(ROOT, './index.html'))
    })

    app.post('/event/auditEvent', (req, rsp) => {
      const errno = 0
      const errmsg = 'ok'

      rsp.json({ errno, errmsg })
    })
}
