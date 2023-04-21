import {Searchable} from 'commons/decorator/Searchable.es6'

@Searchable({module : 'sdl.vulner'})
class Vulner {

    found_time = {
        order : 1,
        search : false
    }

    level_name = {
        order : 2,
        search : false
    }

    type_name = {
        order : 3,
        search : false
    }

    sf_path = {
        order : 4,
        label : 'sdl.vulner.sf_path_code',
        search : false
    }

    df_path = {
        order : 5,
        label : 'sdl.vulner.df_path_code',
        search : false
    }

    action = ['detail']

}

export default new Vulner()