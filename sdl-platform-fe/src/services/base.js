import ajax from '@/plugin/ajax'

// 获取查询部门
export function deptSearchList(query) {
  return ajax.get('/common/dept/query?name=' + query)
}

// 获取员工
export function empSearchList(query) {
  return ajax.get('/common/emp/query?account=' + query)
}

export function getDeptById(id) {
  return ajax.get('/dept/info', {
    dept_id: id
  })
}

export function getEmpById(id) {
  return ajax.get('/emp/info', {
    emp_id: id
  })
}
