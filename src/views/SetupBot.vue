<template>
  <h1>{{t('setupBot.title')}}</h1>

  <div class="mt-3 instructions">
    <p>{{t('setupBot.instructions.intro')}}</p>
    <ol>
      <li>{{t('setupBot.instructions.ladyPeiNoStartingResources')}}</li>
      <li>{{t('setupBot.instructions.youAreFirstPlayer', {startingMoney})}}</li>
      <li>{{t('setupBot.instructions.chooseSetupCard')}}</li>
      <li>{{t('setupBot.instructions.ladyPeiStartingGarden')}}</li>
    </ol>
  </div>

  <button class="btn btn-primary btn-lg mt-4" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons backButtonRouteTo="/setupGame" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import BotMode from '@/services/enum/BotMode'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  computed: {
    startingMoney() : number {
      if (this.state.setup.botMode == BotMode.ADVANCED) {
        return 6
      }
      return 8
    }
  },
  methods: {
    startGame() : void {
      this.$router.push('/round/0/turn/0')
    }
  }
})
</script>

<style lang="scss" scoped>
.instructions {
  max-width: 1000px;
  ol > li {
    margin-top: 0.5rem;
  }
}
</style>
