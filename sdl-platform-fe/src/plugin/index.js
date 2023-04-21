import { subscribe, publish, dispatch, cancel, broadcast, listen, trigger } from './event'
import { remove } from './array'
import { highlight } from './hljs'
import ajax from './ajax'
import throttle from './throttle'
import getPdf from './pdf'
import throttleDebounce from './throttleDebounce'
import {
  date,
  format2Date,
  format2Time
} from './date'
import {
	capitalize,
	uppercase,
	lowercase,
	currency,
	json
} from './filters'
import { errSrc, focus } from './directives/dom'
import clickOutside from './directives/clickOutside'
import permission from '@/components/permission'
import widget from '@/components/widget'
import shield from '@/components/shield'
import table from '@/components/table'
import tableColumn from '@/components/tableColumn'
import searchTable from '@/components/searchTable'
import searchForm from '@/components/searchForm'
import searchFormItem from '@/components/searchForm/item'
import appLink from '@/components/appLink'
import appMuuri from '@/components/muuri'
import appMuuriPortal from '@/components/muuri/portal'
import appMuuriConfig from '@/components/muuri/config'
import appDictionary from '@/components/appDictionary'
import appHigthDictionary from '@/components/dictionary'
import TreeViewItemValue from '@/components/treeView/TreeViewItemValue'
import TreeViewItem from '@/components/treeView/TreeViewItem'
import TreeView from '@/components/treeView/TreeView'
import department from '@/components/department'
import employee from '@/components/employee'

const plugin = {

	install: (Vue, option) => {

		// register services
		Vue.prototype.$subscribe = subscribe
		Vue.prototype.$publish = publish
    Vue.prototype.$cancel = cancel
		Vue.prototype.$dispatch = dispatch
		Vue.prototype.$broadcast = broadcast
		Vue.prototype.$listen = listen
		Vue.prototype.$trigger = trigger
		Vue.prototype.$remove = remove
    Vue.prototype.$ajax = ajax
    Vue.prototype.$date = date
    Vue.prototype.$throttle = throttle
    Vue.prototype.$getPdf = getPdf

		Vue.filter('capitalize', capitalize)
		Vue.filter('uppercase', uppercase)
		Vue.filter('lowercase', lowercase)
		Vue.filter('currency', currency)
		Vue.filter('json', json)
    Vue.filter('toDate', format2Date)
    Vue.filter('toTime', format2Time)

    Vue.component('app-permission', permission)
    Vue.component('app-widget', widget)
    Vue.component('app-shield', shield)
    Vue.component('app-table', table)
    Vue.component('app-table-column', tableColumn)
    Vue.component('app-search-form', searchForm)
    Vue.component('app-search-form-item', searchFormItem)
    Vue.component('app-search-table', searchTable)
    Vue.component('app-link', appLink)
    Vue.component('app-muuri', appMuuri)
    Vue.component('app-muuri-portal', appMuuriPortal)
    Vue.component('app-muuri-config', appMuuriConfig)
    Vue.component('app-dictionary', appDictionary)
    Vue.component('app-hight-dictionary', appHigthDictionary)
    Vue.component('tree-view-item-value', TreeViewItemValue)
    Vue.component('tree-view-item', TreeViewItem)
    Vue.component('tree-view', TreeView)
    Vue.component('app-department', department)
    Vue.component('app-employee', employee)
    Vue.component('throttleDebounce', throttleDebounce)

    Vue.directive('focus', focus)
    Vue.directive('errSrc', errSrc)
    Vue.directive('clickOutside', clickOutside)
    Vue.directive('highlight', highlight)

    // TODO register mixins
	}
}

export default plugin
