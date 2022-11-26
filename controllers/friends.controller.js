const model =  require('../models/friends.model')

function postFriend(req, res) {
    if (!req.body.name) {
        return res.status(400).json({
            error: "Bad request",
        });
    }

    const newFriend = {
        id: model.length,
        name: req.body.name,
    };
    model.push(newFriend);
    res.status(200).json(newFriend);
}

function getFriends(req, res) {
    res.json(model);
}

function getFriend(req, res) {
    const friendId = +req.params.friendId;
    const friend = model.find((friend) => friend.id === friendId);
    if (friend) res.json(friend);
    else
        res.status(404).json({
            error: "Friend not found",
        });
}

module.exports = {
    getFriends,
    getFriend,
    postFriend,
}
