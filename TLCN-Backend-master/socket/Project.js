module.exports = function ({ projectid }) {
    const listClient = new Map()
    let commentHistory = []

    function broadcastComment(message) {
        listClient.forEach(m => m.emit('commentaction', message))
    }

    function addUser(client) {
        listClient.set(client.id, client)
        console.log(client.id + ' add, ' + listClient.size)
    }

    function removeUser(client) {
        listClient.delete(client.id)
        console.log(client.id + ' remove, ' + listClient.size)
    }

    function serialize() {
        return {
            projectid,
            numClient: listClient.size
        }
    }

    function addEntry(entry) {
        commentHistory = commentHistory.concat(entry)
      }
    
      function getCommentHistory() {
        return commentHistory.slice()
      }

    return {
        broadcastComment,
        addUser,
        removeUser,
        serialize,
        addEntry,
        getCommentHistory,
    }
}
