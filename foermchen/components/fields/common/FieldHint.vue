<script setup lang="ts">
import { marked } from 'marked'

interface HintProps {
  hint: string
}

defineProps<HintProps>()

function parseMarkdown(text: string) {
  return marked(text)
}
</script>

<template>
  <div v-html="parseMarkdown(hint)"></div>
</template>
