<template>
    <section>
        <p class="page-title">{{$t('sdl.vulner.title')}}</p>
        <div>
            <b-tabs>
                <b-tab :title="$t('sdl.vulner.task')" v-if="showTask">
                    <VulnerTab :history="false"></VulnerTab>
                </b-tab>
                <b-tab :title="$t('sdl.vulner.history')">
                    <VulnerTab :history="true"></VulnerTab>
                </b-tab>
            </b-tabs>
        </div>
    </section>

</template>

<script>
    import VulnerTab from './Vulner.vue'
    export default {

        data() {
            return {
                showTask: true
            }
        },
        
        components : {
            VulnerTab
        },

        created () {
            let task_id = this.$route.params.task_id
            this.showTask = !!task_id
        }
    }
</script>

<style scoped>

</style>