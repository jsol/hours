module.exports = {
  config: {
    doc: '',
    format: '*',
    env: 'CONFIG',
    arg: 'config',
    default: './config.json'
  },
  jwtsecret: {
    doc: '',
    format: '*',
    env: 'JWTSECRET',
    arg: 'jwtsecret',
    default: 'dev'
  },
  email: {
    host: {
      doc: '',
      format: '*',
      env: 'EMAIL_HOST',
      arg: 'email-host',
      default: 'localhost'
    },
    user: {
      doc: '',
      format: '*',
      env: 'EMAIL_USER',
      arg: 'email-user',
      default: ''
    },
    password: {
      doc: '',
      format: '*',
      env: 'EMAIL_PASSWORD',
      arg: 'email-password',
      default: ''
    },
    ssl: {
      doc: '',
      format: 'Boolean',
      env: 'EMAIL_USE_SSL',
      arg: 'email-use-ssl',
      default: true
    },
    from: {
      doc: '',
      format: '*',
      env: 'EMAIL_FROM_ADDRESS',
      arg: 'email-from-address',
      default: ''
    },
    subject: {
      doc: '',
      format: '*',
      env: 'EMAIL_SUBJECT',
      arg: 'email-subject',
      default: ''
    }
  },
  app: {
    port: {
      doc: '',
      format: 'port',
      env: 'APP_PORT',
      arg: 'app-port',
      default: 5050
    },
    url: {
      doc: '',
      format: '*',
      env: 'APP_URL',
      arg: 'app-url',
      default: 'http://localhost/'
    }
  },
  mysql: {
    port: {
      doc: '',
      format: 'port',
      env: 'MYSQL_PORT',
      arg: 'mysq-port',
      default: 3306
    },
    host: {
      doc: '',
      format: '*',
      env: 'MYSQL_HOST',
      arg: 'mysql-host',
      default: 'localhost'
    },
    user: {
      doc: '',
      format: '*',
      env: 'MYSQL_USER',
      arg: 'mysql-user',
      default: 'hours'
    },
    password: {
      doc: '',
      format: '*',
      env: 'MYSQL_PASSWORD',
      arg: 'mysql-password',
      default: 'secret'
    },
    database: {
      doc: '',
      format: '*',
      env: 'MYSQL_DATABASE',
      arg: 'mysql-database',
      default: 'hours'
    },
    connectionLimit: {
      doc: '',
      format: 'nat',
      env: 'MYSQL_CONNECTIONLIMIT',
      arg: 'mysql-connectionLimit',
      default: 10
    }
  }
}
