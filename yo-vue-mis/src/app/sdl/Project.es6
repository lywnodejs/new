import {Searchable} from 'commons/decorator/Searchable.es6'

@Searchable({module : 'sdl.project'})
class Project {

    create_time = {
        order : 1,
        search : ['create_begin_time', 'create_end_time']
    }

    git_url = {
        order : 3,
        label : 'sdl.task.git_url',
        align : 'left'
    }

    department = {
        order : 4,
        label : 'sdl.task.department',
        search : 'dept_id'
    }

    git_relative_path = {
        order : 5,
        label : 'sdl.task.git_relative_path',
        search : false
    }

    last_check_time = {
        order : 6,
        search : ['check_begin_time', 'check_end_time']
    }

    action = ['detail']

}

export default new Project()
