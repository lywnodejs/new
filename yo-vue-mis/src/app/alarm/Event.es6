import { Searchable } from 'commons/decorator/Searchable.es6'

@Searchable({ module: 'alarm.event' })
class AlarmEvent {

    id = {
      order: 1
    }

    createTime = {
      order: 2,
      search: ['create_begin_time', 'create_end_time']
    }

    name = {
      order: 3
    }

    eventTime = {
      order: 4,
      search: ['event_begin_time', 'event_end_time']
    }

    status = {
      order: 5,
      default: 0
    }
}
export default new AlarmEvent()
