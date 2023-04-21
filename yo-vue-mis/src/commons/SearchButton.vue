<template>
    <button class="btn btn-primary" @click.stop="action" :disabled="status">
        <template v-if="status">
            <i class="fa fa-spinner fa-spin fa-fw"></i>
            <span>{{$t('hint.loading')}}</span>
        </template>
        <template v-else>
            <i class="fa fa-search" aria-hidden="true"></i> {{$t('buttons.query')}}
        </template>
    </button>
</template>

<script>
    export default {
        props : {
            status : {
                type : Boolean,
                default : false
            },

            action : {
                type : Function,
                default : null
            }
        }
    }
</script>

<style scoped>

</style>