import { Searchable } from 'commons/decorator/Searchable.es6'

@Searchable({ module: 'report' })
class EventReport {

    id = {
        order: 1,
        align: 'center'
    }

    status = {
        default: 0,
        align: 'center',
        order: 2
    }

    name = {
        order: 3,
        search: 'name'
    }

    event_time = {
        align: 'center',
        order: 4
    }

    create_time = {
        align: 'center',
        order: 5
    }

    action = ['detail']

}
export default new EventReport()