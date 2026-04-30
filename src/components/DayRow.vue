<script setup>
defineProps({
    date:           { type: Date,    required: true },
    rowData:        { type: Array,   required: true },
    isToday:        { type: Boolean, default: false },
    isTodayLastDay: { type: Boolean, default: false },
})
defineEmits(['update'])
</script>

<template>
  <tr></tr>
</template>
