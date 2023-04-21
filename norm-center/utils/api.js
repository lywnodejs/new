import fetch from '~/utils/fetch'

export default {
  // 获取基础指标列表
  getNormBase(params) {
    return {
      data: {
        data: {
          list: [
            {
              id: 1,
              group: 'jack',
              name: 'name1',
              sql:
                'select s.name,c.name from students as s inner join classes as c on s.cls_id = c.id;',
            },
            {
              id: 2,
              group: null,
              name: 'name2',
              sql:
                'select s.name,c.name from students as s inner join classes as c on s.cls_id = c.id;',
            },
          ],
          totalSize: 100,
        },
        code: 0,
      },
    }
    return fetch(
      'fincloud.ds.management.facade.api.dscompanyservice.getcompanypage',
      [params],
    )
  },
}
