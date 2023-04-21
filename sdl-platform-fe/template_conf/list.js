module.exports = {

  // 高级查询项
  "fields": [{
    "label": "授权人员",
    "prop": "account",
    "type": "input"
  }],

  // 列表查询地址
  "url": "sd/auth/list",

  // 列表名称
  "tableRefs": "accreditTable",

  // 是否显示分页
  "pagination": true,

  // 是否固定显示分页
  "isPaginationFloat": true,

  // 列表展示项
  "columns": [{
      "label": "授权人员",
      "prop": "name"
    },
    {
      "label": "账号",
      "prop": "account"
    },
    {
      "label": "邮箱地址",
      "prop": "email"
    },
    {
      "label": "所属部门",
      "prop": "dept_name"
    },
    {
      "label": "授权操作人",
      "prop": "create_user_name"
    },
    {
      "label": "创建时间",
      "prop": "create_time"
    },
    {
      "label": "操作",
      "prop": "action"
    }
  ]
}
