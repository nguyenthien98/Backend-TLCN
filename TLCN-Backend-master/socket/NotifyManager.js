const Project = require('./Project')

module.exports = function () {
    // mapping of all available chatrooms
    const projects = new Map()

    function removeClient(client) {
        projects.forEach(c => c.removeUser(client))
    }

    function getProjectById(projectid) {
        if (projects.get(projectid) === undefined) {
            projects.set(projectid, Project(projectid))
        }
        return projects.get(projectid)
    }

    function serializeProjects() {
        return Array.from(projects.values()).map(c => c.serialize())
    }

    return {
        removeClient,
        getProjectById,
        serializeProjects,
    }
}