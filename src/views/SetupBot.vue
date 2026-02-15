<template>
  <h1>{{t('setupBot.title')}}</h1>

  <p>...</p>

  <button class="btn btn-primary btn-lg mt-4" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  methods: {
    startGame() : void {
      this.$router.push('/round/0/turn/0')
    }
  }
})
</script>
