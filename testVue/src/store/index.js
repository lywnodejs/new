import { defineStore } from "pinia";


export const useStore = defineStore('main',{
    state:()=>{
        return {
            count:'test'
        }
    },
    actions:{
        setCount(val){
            this.count = val;
        }
    },
    getters:{
        getCount(state){
            return state.count + 10
        }
    }
})
