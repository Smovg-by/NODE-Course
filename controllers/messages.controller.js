const path = require('path')

function getMessages(req, res) {
    // res.send('<b>Hello, Albert</b>')
    res.sendFile(path.join(__dirname, '..', 'public', 'images', 'random.jpg'))
}

function postMessage(req, res) {
    res.send('Updating messages...')
}

module.exports = {
    getMessages,
    postMessage,
}