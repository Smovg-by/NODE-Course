function getMessages(req, res) {
    res.send('<b>Hello, Albert</b>')
}

function postMessage(req, res) {
    res.send('Updating messages...')
}

module.exports = {
    getMessages,
    postMessage,
}