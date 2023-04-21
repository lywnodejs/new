<template>
    <div>
        <h1>{{username}}</h1>
    </div>
</template>

<script>
    import Vue from 'vue'
    class Task {

        get data () {
            return {
                username : 'yiifaa'
            }
        }
    }
    export default  new Task()
</script>