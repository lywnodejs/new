import { Searchable } from 'commons/decorator/Searchable.es6'

@Searchable({ module: 'manage.event' })
class ManageEvent {

  event_no = {
    order: 1
  }

  event_name = {
    order: 2
  }

  types = {
    order: 3,
    default: []
  }

  levels = {
    order: 4,
    default: []
  }

  source = {
    order: 5,
    default: null
  }

  system = {
    order: 6,
    default: null
  }

  dept_id = {
    order: 7
  }

  emp_id = {
    order: 8
  }

  status = {
    order: 5,
    default: 0
  }

}
export default new ManageEvent()
