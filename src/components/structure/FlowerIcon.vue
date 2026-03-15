<template>
  <svg width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="13" :fill="color" stroke="#aaa" stroke-width="0.5"/>
    <text x="14" y="14" text-anchor="middle" dominant-baseline="central"
        :fill="textColor" font-size="15" font-weight="bold">{{letter}}</text>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Flower from '@/services/enum/Flower'
import getFlowerColor from '@/util/getFlowerColor'

export default defineComponent({
  name: 'FlowerIcon',
  props: {
    flower: {
      type: String as () => Flower,
      required: true
    }
  },
  computed: {
    color() : string {
      return getFlowerColor(this.flower)
    },
    textColor() : string {
      return this.flower === Flower.YELLOW ? '#333' : '#fff'
    },
    letter() : string {
      return this.flower.charAt(0).toUpperCase()
    }
  }
})
</script>
