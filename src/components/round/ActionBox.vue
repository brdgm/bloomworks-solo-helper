<template>
  <div class="actionBox col" @click="showInstructions"
      :class="{'instruction': hasInstruction, 'managedByApp': managedByApp}">
    <slot name="action"></slot>
    <div v-if="currentCard?.remove" class="remove"><AppIcon name="x" class="icon"/></div>
  </div>

  <ModalDialog :id="modalId" :title="instructionTitle" :scrollable="true" :size-lg="modalSizeLg">
    <template #body>
      <slot name="instruction"></slot>
      <p v-if="managedByApp" class="fst-italic" v-html="t('rules.action.managedByApp')"/>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import showModal from '@brdgm/brdgm-commons/src/util/modal/showModal'
import { useI18n } from 'vue-i18n'
import { nanoid } from 'nanoid'
import Card from '@/services/Card'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'ActionBox',
  components: {
    ModalDialog,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    const modalId = `modal-${nanoid()}`
    return { t, modalId }
  },
  props: {
    instructionTitle: {
      type: String,
      required: true
    },
    managedByApp: {
      type: Boolean,
      required: false
    },
    modalSizeLg: {
      type: Boolean,
      required: false
    },
    currentCard: {
      type: Object as PropType<Card>,
      required: false
    }
  },
  computed: {
    hasInstruction() : boolean {
      return this.$slots.instruction !== undefined
    }
  },
  methods: {
    showInstructions() {
      if (this.hasInstruction) {
        showModal(this.modalId)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.actionBox {
  position: relative;
  background-color: #c3cce8;
  border: 2px solid #9ca1af;
  border-radius: 0.5rem;
  margin-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  &.managedByApp {
    background-color: #ccc;
    border-color: #aaa;
  }
  &.instruction {
    cursor: pointer;
    background-image: url('@/assets/icons/help-semi-transparent.webp');
    background-repeat: no-repeat;
    background-position: right 5px top 5px;
    background-size: 1.25rem;
  }
}
.remove {
  position: absolute;
  right: 8px;
  bottom: 5px;
  .icon {
    width: 0.75rem;
  }
}
</style>
