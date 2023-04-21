import {Searchable} from 'commons/decorator/Searchable.es6'

@Searchable({module : 'sdl.rule'})
class SdlRule {

    rule_id = {
        order : 1,
        search : false
    }

    rule_name = {
        order : 2,
        search : false
    }

    level_name = {
        order : 3
    }

    language = {
        order : 4,
        search : false
    }

    type_name = {
        order : 5,
        search : false
    }

    evaluate_name = {}

    knowledge_id = {}

    action = ['detail']
}
export default new SdlRule()
