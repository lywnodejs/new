export const state = () => ({
    title:'研报头条',
    items:[],
  })

export const mutations = {
  getTitle(state,name){
      state.title=name;
  },
  setList: (state, data) => {
    state.items = data
  },
}
