import {GIT_PREFIX} from '@/constants.es6'

/**
* 去掉git地址的前缀
*/
export function suffixGit (url) {
    if(url) {
        let index = url.indexOf(GIT_PREFIX),
            len = GIT_PREFIX.length
        if(index > -1) {
            return url.substr(len)
        }
        return url
    }
    return ''
}

/**
 * 格式化奥丁部署地址
 * @param value 
 * @param key 
 */
export function odin_node (value, key) {
    const tmpl = nodes => `
              <ul class="list-group">
                  ${nodes.map(node => 
                      `
                          <li class="list-group-item">${node}</li>
                      `
                  ).join('')}
              </ul>
           `
    if(!!value) {
        return tmpl(value)
    }
    return ''
}

export const infoUrl = function (email) {
    if(email) {
        let index = email.indexOf('@'),
            name = email.substr(0, index)
        return `http://home.didichuxing.com/person.html#/${name}/1`    
    }
    return ''
}

export const rd = function (value, key) {
    if(value instanceof Array) {
        let html = ''
         value.forEach(r => {
             html += `<a target="_blank" href="${infoUrl(r.email)}">${r.name}</a>&nbsp;&nbsp;`
         })
         return html
    }
    return value
}