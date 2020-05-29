module.exports = function () {
    // mapping of all connected clients
    const clients = new Map()

    function addClient(client) {
        clients.set(client.id, { client })
    }

    function registerClient(client, email) {
        clients.set(client.id, { client, email })
    }

    function removeClient(client) {
        clients.delete(client.id)
    }

    function getUserByClientId(clientId) {
        return (clients.get(clientId) || {}).email
    }

    function getAvailableClient() {
        return clients.slice()
    }

    return {
        addClient,
        registerClient,
        removeClient,
        getUserByClientId,
        getAvailableClient,
    }
}
