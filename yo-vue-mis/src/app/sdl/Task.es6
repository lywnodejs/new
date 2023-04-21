import {Searchable} from 'commons/decorator/Searchable.es6'

@Searchable({module : 'sdl.task'})
class SdlTask {

    task_create_time = {
        order: 1,
        search: ['begin_time', 'end_time']
    }

    git_url = {
        order: 2,
        align: 'left'
    }

    department = {
        order: 3,
        search: 'dept_id',
        default : null
    }

    rd = {
        order: 4
    }

    se = {
        order: 5
    }

    status = {
        order: 6
    }

    action = ['detail']

}
export default new SdlTask()
