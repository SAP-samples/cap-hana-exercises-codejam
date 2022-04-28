const cds = require('@sap/cds')
module.exports = cds.service.impl(function () {
    this.on('sleep', async () => {
    try {
        const dbClass = require("sap-hdb-promisfied")
        let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
        const sp = await dbConn.loadProcedurePromisified(null, '"sleep"')
        const output = await dbConn.callProcedurePromisified(sp, [])
        console.log(output.results)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
    })
})
