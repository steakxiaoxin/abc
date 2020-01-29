const { exec, escape } = require('../db/mysql')

module.exports = {
  login: async (username, password) => {
    username = escape(username)
    password = escape(password)
    let sql = `select realname, username from users where username=${username} and password=${password};`
    return exec(sql).then(rows => rows[0] || {})
  },
}
