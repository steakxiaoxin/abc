const { exec, escape } = require('../db/mysql')
const xss = require('xss')

module.exports = {
  list: async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
      sql += `and author='${author}' `
    }
    if (keyword) {
      sql += `and title like '%${keyword}%' `
    }
    sql += 'order by createtime desc;'
    // 返回 Promise
    return exec(sql)
  },
  detail: async id => {
    let sql = `select * from blogs where id='${id}';`
    return exec(sql).then(rows => rows[0])
  },
  new: async blogData => {
    const { title, content, author } = blogData
    const createtime = Date.now()
    let sql = `insert into blogs (title,content,createtime,author) values ('${xss(title)}','${content}',${createtime},'${author}');`
    return exec(sql).then(insertData => {
      return { id: insertData.insertId }
    })
  },
  update: async (id, blogData) => {
    const { title, content } = blogData
    let sql = `update blogs set title='${title}', content='${content}' where id='${id}';`
    return exec(sql).then(updateData => {
      return updateData.affectedRows > 0
    })
  },
  delete: async (id, author) => {
    let sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(deleteData => {
      return deleteData.affectedRows > 0
    })
  },
}
