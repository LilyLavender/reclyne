<script setup>
import { computed } from 'vue'
import { weekdaysShort } from '../utils/dates'
import { scrollToEl } from '../utils/scroll'

const props = defineProps({
    date:           { type: Date,    required: true },
    rowData:        { type: Array,   required: true },
    isToday:        { type: Boolean, default: false },
    isTodayLastDay: { type: Boolean, default: false },
})

const emit = defineEmits(['update'])

const weekday    = computed(() => weekdaysShort[props.date.getDay()])
const monthShort = computed(() => props.date.toLocaleString('default', { month: 'short' }))
const dayNum     = computed(() => props.date.getDate())

function onInput(j, val) {
    const updated = [...props.rowData]
    updated[j] = val.replace('§', '')
    emit('update', updated)
}

function onArrowClick(e) {
    scrollToEl(e.currentTarget, true)
}
</script>

<template>
  <tr class="day" :class="{ today: isToday }">
    <td
      :class="weekday"
      :style="isTodayLastDay ? { borderBottomLeftRadius: '0' } : {}"
    >{{ monthShort }} {{ dayNum }}</td>
    <td v-for="(val, j) in rowData" :key="j">
      <input
        type="text"
        :value="val"
        @input="onInput(j, $event.target.value)"
        autocomplete="off"
        spellcheck="false"
      />
    </td>
    <i
      v-if="isToday"
      class="bi bi-arrow-right arrow-container"
      :style="isTodayLastDay ? { borderBottomRightRadius: '5px' } : {}"
      @click="onArrowClick"
    ></i>
  </tr>
</template>
