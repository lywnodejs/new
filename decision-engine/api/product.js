import fetch from '~/utils/fetch'
export default {
  get_products: () => {
    return fetch(
      `fincloud.engine.facade.service.design.productservice.queryproduct`,
    )
  },
  delete_product: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.productservice.deleteproduct`,
      [params],
    )
  },
  add_product: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.productservice.insertproduct`,
      [params],
    )
  },
  edit_product: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.productservice.updateproduct`,
      [params],
    )
  },
  get_index_data: (params) => {
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.querycountinfo`,
      [params],
    )
  },
}
