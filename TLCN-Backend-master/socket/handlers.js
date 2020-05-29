function makeHandleEvent(client, clientManager, notifyManager) {

    function ensureExists(getter, rejectionMessage) {
        return new Promise(function (resolve, reject) {
            const res = getter()
            return res ? resolve(res) : reject(rejectionMessage)
        })
    }

    function ensureUserSelected(clientId) {
        return ensureExists(() =>
            clientManager.getUserByClientId(clientId),
            'select user first'
        )
    }

    function ensureValidProject(projectid) {
        return ensureExists(() =>
            notifyManager.getProjectById(projectid),
            `invalid project id: ${projectid}`
        )
    }

    function ensureValidProjectAndUserSelected(projectid) {    
        return new Promise((resolve, reject) => { 
            Promise.all([ensureValidProject(projectid), ensureUserSelected(client.id)])
            .then(([project, user]) => {
                const res = { project, user }
                resolve(res)
            })
        }) 
       
    }

    function handleEvent(projectid, createEntry) {
        return ensureValidProjectAndUserSelected(projectid)
            .then(res => {
                // append event to comment history
                const entry = { user: res.user, ...createEntry() }
                res.project.addEntry(entry)
                // notify other clients in project 
                res.project.broadcastComment({ project: projectid, ...entry })
                return res.project
            })
    }

    return handleEvent
}

module.exports = function (client, clientManager, notifyManager) {
    const handleEvent = makeHandleEvent(client, clientManager, notifyManager)

    function handleRegister(email, callback) {
        clientManager.registerClient(client, email)
        return callback(null, email)
    }

    function handleJoin(projectid, callback) {
        const createEntry = () => ({ event: `joined ${projectid}` })
        handleEvent(projectid, createEntry)
            .then(project => {
                // add member to project and can see comment
                project.addUser(client)

                // send comment history to client
                callback(null, chatroom.getCommentHistory())
            })
            .catch(callback)
    }

    function handleLeave(projectid, callback) {
        const createEntry = () => ({ event: `left ${projectid}` })
        handleEvent(projectid, createEntry)
            .then(project => {
                // remove member from project
                project.removeUser(client)
                callback(null)
            })
            .catch(callback)
    }

    function handleComment(commentObject, callback) {
        const createEntry = () => ({ content: commentObject.content })
        handleEvent(commentObject.projectid, createEntry)
            .then(() => callback(null))
            .catch(callback)
    }

    function handleGetProjects(_, callback) {
        return callback(null, notifyManager.serializeProjects())
    }

    function handleGetAvailableClients(_, callback) {
        return callback(null, clientManager.getAvailableUsers())
    }

    function handleDisconnect() {
        // remove user profile
        clientManager.removeClient(client)
        // remove member from all chatrooms
        notifyManager.removeClient(client)
    }

    return {
        handleRegister,
        handleJoin,
        handleLeave,
        handleComment,
        handleGetProjects,
        handleGetAvailableClients,
        handleDisconnect,
    }
}
