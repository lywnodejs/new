<template>
  <div :class="['p-filter-operate', center ? 'wrap-center' : 'flex-between']">
    <ul class="p-filter-menu">
      <li :class="{hover: tab.id == activeTab}"
        v-for="tab in tabs" :key="tab.id"
        @click="handleClick(tab.id)">
        {{tab.label}}
      </li>
    </ul>
    <div class="p-filter-button">
      <slot></slot>
    </div>
  </div>

</template>

<script>
export default {
  name: 'FilterTab',
  props: {
    activeTab: null,
    tabs: Array,
    center: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick(id) {
      this.$emit('change', id)
    }
  }
};
</script>

<style lang="less">
.p-filter-operate {
  padding: 0 20px;
  &.wrap-center {
    text-align: center
  }
  &.flex-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .p-filter-menu {
    font-size: 0;
    display: inline-block;
    vertical-align: middle;
    list-style: none outside none;
    border-bottom: solid 1px #f3f4f5;
    margin: 0;
    padding: 0;
  }
  .p-filter-menu > li {
    font-size: 14px;
    position: relative;
    padding: 0 16px;
    line-height: 46px;
    text-align: center;
    cursor: pointer;
    color: #262626;
    display: inline-block;
    transition: bottom .5s, color .3s;
  }
  .p-filter-menu > li:before {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 50%;
    left: 50%;
    height: 2px;
    background: #528be6;
    transition-property: left, right;
    transition-duration: .3s;
    transition-timing-function: ease-out;
  }
  .p-filter-menu > li:hover:before, .p-filter-menu > li.hover:before {
    left: 0;
    right: 0;
  }
  .p-filter-menu > li:hover:before, .p-filter-menu > li.hover:before {
    bottom: -1px;
  }
  .p-filter-button {
    float: right;
  }
}
</style>
