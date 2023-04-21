import api from '~/api/risk'
export const categoryTabs = [
  {
    name: '规则集',
    key: 4,
    actionType: 2,
    fields: {
      code: 'ruleSetCode',
      name: 'ruleSetName',
    },
    action: {
      fetch: (params) => {
        return params.partialPro
          ? api.fetch_risk_ruleset_pro({...params, fieldType: null})
          : api.fetch_risk_ruleset_edit({...params, fieldType: null})
      },
      add: ({code, activeKey, name, description, activeModuleKey}) =>
        api.add_risk_ruleset({
          ruleSetCode: code,
          ruleSetName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      edit: ({code, activeKey, name, description, activeModuleKey, id}) =>
        api.edit_risk_ruleset({
          ruleSetCode: code,
          ruleSetName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
          id,
        }),
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_ruleset({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      copy: (params) => api.copy_risk_ruleset(params),
      publish: (params) => api.publish_risk_ruleset(params),
    },
  },
  {
    name: '评分卡',
    key: 5,
    actionType: 3,
    fields: {
      code: 'scoreCardCode',
      name: 'scoreCardName',
    },
    action: {
      fetch: (params) => {
        return params.partialPro
          ? api.fetch_risk_scoreCard_pro({...params, fieldType: null})
          : api.fetch_risk_scoreCard_edit({...params, fieldType: null})
      },
      add: ({code, activeKey, name, description, activeModuleKey}) =>
        api.add_risk_scoreCard({
          scoreCardCode: code,
          scoreCardName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      edit: ({code, activeKey, name, description, activeModuleKey, id}) =>
        api.edit_risk_scoreCard({
          scoreCardCode: code,
          scoreCardName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
          id,
        }),
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_scoreCard({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      copy: (params) => api.copy_risk_scoreCard(params),
      publish: (params) => api.publish_risk_scoreCard(params),
    },
  },
  {
    name: '矩阵',
    key: 6,
    actionType: 4,
    fields: {
      code: 'matrixCode',
      name: 'matrixName',
    },
    action: {
      fetch: (params) => {
        return params.partialPro
          ? api.fetch_risk_matrix_pro({...params, fieldType: null})
          : api.fetch_risk_matrix_edit({...params, fieldType: null})
      },
      add: ({code, activeKey, name, description, activeModuleKey}) =>
        api.add_risk_matrix({
          matrixCode: code,
          matrixName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      edit: ({code, activeKey, name, description, activeModuleKey, id}) =>
        api.edit_risk_matrix({
          matrixCode: code,
          matrixName: name,
          description,
          productId: activeKey,
          moduleType: activeModuleKey,
          id,
        }),
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_matrix({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      copy: (params) => api.copy_risk_matrix(params),
      publish: (params) => api.publish_risk_matrix(params),
    },
  },
  {
    name: '衍生规则',
    key: 7,
    fields: {
      code: 'actionCode',
      name: 'actionName',
    },
    action: {
      fetch: (params) => {
        return params.partialPro
          ? api.fetch_risk_rulederive_pro({...params, fieldType: null})
          : api.fetch_risk_rulederive_edit({...params, fieldType: null})
      },
      add: '',
      edit: '',
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_derive({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      copy: (params) => api.copy_risk_derive(params),
      publish: (params) => api.publish_risk_derive(params),
    },
  },
  {
    name: '决策流',
    key: 8,
    actionType: 6,
    fields: {
      code: 'flowCode',
      name: 'flowName',
    },
    action: {
      fetch: (params) => {
        return params.partialPro
          ? api.fetch_risk_flow_pro({...params, fieldType: null})
          : api.fetch_risk_flow_edit({...params, fieldType: null})
      },
      add: ({code, activeKey, name, description}) =>
        api.add_risk_flow({
          flowCode: code,
          flowName: name,
          description,
          productId: activeKey,
        }),
      edit: ({code, activeKey, name, description, id}) =>
        api.edit_risk_flow({
          flowCode: code,
          flowName: name,
          description,
          productId: activeKey,
          id,
        }),
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_flow({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
      publish: (params) => api.publish_risk_flow(params),
    },
  },
  {
    name: '输出变量',
    key: 1,
    action: {
      fetch: api.fetch_risk_variable,
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_variable({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
    },
  },
  // {
  //   name: '基础变量',
  //   key: 0,
  //   action: {
  //     fetch: api.fetch_risk_variable,
  //     delete: ({ids, activeKey, activeModuleKey}) =>
  //       api.delete_risk_variable({
  //         fieldIds: ids.join(','),
  //         productId: activeKey,
  //         moduleType: activeModuleKey,
  //       }),
  //   },
  // },
  {
    name: '匹配字典',
    key: 2,
    action: {
      fetch: api.fetch_risk_variable,
      delete: ({ids, activeKey, activeModuleKey}) =>
        api.delete_risk_variable({
          ids,
          productId: activeKey,
          moduleType: activeModuleKey,
        }),
    },
  },
  // {
  //   name: '衍生变量',
  //   key: 3,
  //   action: {
  //     fetch: api.fetch_risk_variable,
  //     delete: ({ids, activeKey, activeModuleKey}) =>
  //       api.delete_risk_variable({
  //         fieldIds: ids.join(','),
  //         productId: activeKey,
  //         moduleType: activeModuleKey,
  //       }),
  //   },
  // }
]
let findOneByKey = (key) => {
  return categoryTabs.find((item) => item.key == key)
}
export function findFieldByKey(key, field) {
  let one = findOneByKey(key)
  if (one) {
    return one.fields[field]
  }
}
export function findNameByKey(key, field) {
  let one = findOneByKey(key)
  if (one) {
    return one.name
  }
}

export function findKeyByName(name, field) {
  let one = categoryTabs.find((item) => item.name == name)
  if (one) {
    return one.key
  }
}

export function findActionTypeByKey(key) {
  let one = findOneByKey(key)
  if (one) {
    return one.actionType
  }
}
export function findApiByKey(key, postData, action) {
  let one = findOneByKey(key)
  // console.log(one, 'one')
  if (one) {
    return () => one.action[action](postData)
  }
}
function body(props) {}
export default body
