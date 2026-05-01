<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar'

const props = defineProps({
    dialogName: { type: String, required: true },
    title:      { type: String, default: '' },
})

const calendarStore = useCalendarStore()

const isVisible = computed(() => calendarStore.activeDialog === props.dialogName)
</script>

<template>
  <div
    class="display-box"
    :id="`${dialogName}-box`"
    :class="{ 'hidden-trans': !isVisible }"
  >
    <div class="display-box-header">
      <h4>{{ title }}</h4>
      <slot name="header-extra" />
      <i
        :id="`${dialogName}-close`"
        class="bi bi-x-lg"
        @click="calendarStore.closeAllDialogs()"
      ></i>
    </div>
    <div class="display-box-content">
      <slot />
    </div>
  </div>
</template>
