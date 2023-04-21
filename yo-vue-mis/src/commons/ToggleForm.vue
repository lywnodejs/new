<template>
        <section>
            <div class="toggle-form-title">
                <span>{{$t(title)}}</span>
                <span :class="iconOnly ? null : 'title-toggler'">
                    <a data-toggle="collapse" href="javascript:;" @click.prevent="toggleForm">
                     {{toggleHint}}<i class="fa" :class="{'fa-chevron-up' : !formTogger, 'fa-chevron-down': formTogger}" aria-hidden="true" style="margin-left: 5px;"></i>
                    </a>
                </span>
                <span style="float: right">
                  <slot name="buttons"></slot>
                </span>
            </div>
            <hr>
            <div class="collapse collapse-form" :class="{'show' : formTogger}">
                <div class="">
                    <form @submit.prevent>
                        <div class="form-group row">
                            <slot></slot>
                        </div>
                    </form>
                </div>
            </div>
        </section>
</template>

<script>
export default {

    name: 'TOGGLE-FORM',

    props: {
        title: {
            type: String,
            default: 'title'
        },
        iconOnly: {
          type: Boolean,
          default: false
        }
    },

    data() {
        return {
            formTogger: true
        }
    },

    computed: {
        toggleHint() {
          if (this.iconOnly) return ''
          return this.formTogger ? this.$t('buttons.toggle') : this.$t('buttons.query')
        }
    },

    methods: {
        toggleForm() {
            this.formTogger = !this.formTogger
        }
    }
}
</script>
<style lang="less">
  .toggle-form-title {
    &:after {
      content: '';
      display: inline-block;
      clear: both;
    }
  }
</style>

