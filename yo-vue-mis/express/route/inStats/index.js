const path = require('path'),
    ROOT = require('../../Constanst').ROOT

module.exports = function (app) {
    app.get('/portals/pages/inStats.html', (req, rsp) => {
        rsp.sendFile(path.resolve(ROOT, './index.html'))
    })
}
