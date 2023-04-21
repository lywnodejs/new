<template>
    <div class="col-sm-6 form-field">
        <div class="row">
            <label :for="forId" class="col-sm-3 col-form-label">{{$t(label)}}</label>
            <div class="col-sm-9">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    forId: {
      type: String,
      default: ""
    },

    label: {
      type: String
    }
  }
};
</script>
<style scoped>
.col-form-label {
  text-align: right;
}

.col-form-label::after {
  content: ":";
}

.form-field {
  margin-bottom: 15px;
}
</style>
