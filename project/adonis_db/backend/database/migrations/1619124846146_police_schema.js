'use strict'
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PoliceSchema extends Schema {
  up () {
    this.create('police', (table) => {
      table.increments()
      table.string('rank')
      table.string('name')
      table.string('surname')
      table.string('position')    
      table.string('dob')
      table.string('education')
      table.string('training')
      table.string('civil_history')
      table.string('civil_year')
      table.string('reward')
      table.string('appoint')
      table.string('telephone')
      table.timestamps()
    })
  }
  down () {
    this.drop('police')
  }
}
module.exports = PoliceSchema
