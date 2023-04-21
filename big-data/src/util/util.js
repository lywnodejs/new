class Util {
    findRepeatArr(arr1,arr2) {
        let resArr = [],
            arrTwo = arr2 || [],
            arr2Name = [];
            arrTwo.map(obj=>{
                arr2Name.push(obj.term)
            })
        for(let i = 0; i<arr1.length; i++){
            for(let j = 0; j<arr2Name.length; j++){
                if(arr1[i] == arr2Name[j]){
                    resArr.push(arr1[i])
                }
            }
        }
        return resArr.length && resArr.join(',') || '';
    }
}
const util = new Util()
export default util;