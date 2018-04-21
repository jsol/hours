const convict = require('convict')
const schema = require('./config_schema.js')

const config = convict(schema)

try {
  if (config.get('config')) {
    config.loadFile(config.get('config'))
  } else {
    console.log('No config file set, running on default values')
  }
} catch (err) {
  throw new Error(`Error reading config file. Message: ${err.message}.`)
}

try {
  config.validate({ allowed: 'strict' })
} catch (err) {
  throw new Error(`Error validating config file. Message: ${err.message}`)
}
module.exports = config
