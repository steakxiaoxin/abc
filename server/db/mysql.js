const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 创建链接
con.connect()

const exec = sql => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

// 保持链接状态 不用写 con.end() 断开链接

module.exports = { exec, escape: mysql.escape }
