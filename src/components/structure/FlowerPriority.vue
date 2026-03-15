<template>
  <span class="flowerPriority">
    <FlowerIcon v-for="flower in flowerOrder" :key="flower" :flower="flower" class="flowerIcon"/>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Flower from '@/services/enum/Flower'
import FlowerIcon from './FlowerIcon.vue'

export default defineComponent({
  name: 'FlowerPriority',
  components: {
    FlowerIcon
  },
  props: {
    flowerOrder: {
      type: Array as () => Flower[],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.flowerPriority {
  display: inline-flex;
  gap: 0.1rem;
  margin-top: 0.25rem;
}
.flowerIcon {
  width: 1.5rem;
}
</style>