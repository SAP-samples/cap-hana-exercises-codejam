const cds = require('@sap/cds')

/**
 * Service implementation for CatalogService.
 *
 * @function sleep
 *   Invokes the HANA `sleep` stored procedure via the db service.
 *   Used to demonstrate calling native HANA procedures from CAP.
 *   @returns {boolean} true on success
 *   @throws  {Error}   re-throws any db error as a CAP error so the
 *                      framework returns a proper HTTP 500 to the client
 */
module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to('db')

    this.on('sleep', async () => {
        try {
            const result = await db.run('Call "sleep"()')
            cds.log('sleep').debug(result)
            return true
        } catch (error) {
            cds.log('sleep').error(error)
            throw cds.error(error)
        }
    })
})
