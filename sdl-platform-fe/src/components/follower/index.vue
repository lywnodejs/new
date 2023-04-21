<template>
    <div class="follower">
        <h3>关注人列表</h3>
        <div class="followTag">
          <el-tag type="info" v-for="item in followers" :key="item.username" class="tag"><span @click="bouncePerson(item.username)">{{item.name}}</span></el-tag>
        </div>
        <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
        <button class="follower-btn" type="button" @click="addFollower(sdl_project_id, follower)">添&nbsp;加</button>

    </div>
</template>

<script>
import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'
export default {
    name: 'add-follower',
    data() {
        return {
            follower: [],
            followers: [],
            queryParam: {}
        }
    },
    methods: {
        addFollower(id, followers) {
            ajax.post(API.addfollower, {sdl_project_id: id, follower_list: followers}).then(res => {
            this.getFollower(id)
            this.follower = []
            })
        },
        getFollower(id) {
            ajax.post(API.getfollower, {sdl_project_id: id}).then(res => {
            this.followers = res.data
            })
        },
        bouncePerson(name) {
            let url = 'http://i.xiaojukeji.com/space/personal/' + name
            window.open(url)
        }
    }
}
</script>

<style lang="less" scoped>

</style>
