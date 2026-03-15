<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
    <rect x="1" y="1" :width="width-2" :height="height-2" rx="3" ry="3"
        fill="#999" stroke="#666" stroke-width="1"/>
    <text :x="width/2" :y="height/2" text-anchor="middle" dominant-baseline="central"
        fill="#fff" font-size="12" font-weight="bold">{{count}}</text>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardStackIcon',
  props: {
    count: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      default: 20
    },
    height: {
      type: Number,
      default: 24
    }
  }
})
</script>
