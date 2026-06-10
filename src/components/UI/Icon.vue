<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 16 },
})
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Health -->
    <path
      v-if="name === 'heart'"
      fill="#d64545"
      d="M8 13.5 2.6 8.3C1 6.8 1.3 4.2 3.2 3.2 4.5 2.5 6.1 2.9 7 4l1 1.1L9 4c.9-1.1 2.5-1.5 3.8-.8 1.9 1 2.2 3.6.6 5.1L8 13.5Z"
    />
    <!-- Stamina -->
    <path v-else-if="name === 'lightning'" fill="#5cc99e" d="M9 1 3 9h4l-1 6 6-8H8l1-6Z" />
    <!-- Hunger -->
    <path
      v-else-if="name === 'meat'"
      fill="#c98a3b"
      d="M10.5 2.5c1.7 0 3 1.3 3 3 0 1-.5 1.9-1.3 2.5l-4.7 4.7c-.9.9-2.4.9-3.3 0l-1.4-1.4c-.9-.9-.9-2.4 0-3.3l4.7-4.7c.6-.8 1.5-1.3 2.5-1.3 0 0 .3.2.5.5Zm-7 9 1.2 1.2-1.6 1.6-1.2-.1.1-1.2 1.5-1.5Z"
    />
    <!-- Thirst -->
    <path
      v-else-if="name === 'water'"
      fill="#3b7fc9"
      d="M8 1.5c1.8 2.6 4 5.6 4 8a4 4 0 0 1-8 0c0-2.4 2.2-5.4 4-8Z"
    />
    <!-- Warmth -->
    <g v-else-if="name === 'thermometer'">
      <rect x="6.5" y="2" width="3" height="8" rx="1.5" fill="#9aa0a6" />
      <circle cx="8" cy="12" r="2.5" fill="#e08a3c" />
      <rect x="7" y="4" width="2" height="6" fill="#e08a3c" />
    </g>
    <!-- Sanity -->
    <path
      v-else-if="name === 'brain'"
      fill="#9a5cc9"
      d="M5 2c1 0 1.8.5 2.3 1.2C7.8 2.5 8.6 2 9.6 2 11.5 2 13 3.5 13 5.4c0 .6-.2 1.2-.4 1.7.6.5 1 1.2 1 2 0 1.4-1.1 2.6-2.5 2.7-.2 1.2-1.3 2.2-2.6 2.2-.6 0-1.1-.2-1.5-.5-.4.3-.9.5-1.5.5-1.3 0-2.4-1-2.6-2.2C2.1 11.6 1 10.4 1 9c0-.8.4-1.5 1-2-.2-.5-.4-1.1-.4-1.7C1.6 3.5 3.1 2 5 2Z"
    />
    <!-- Sleep -->
    <text v-else-if="name === 'zzz'" x="1" y="12" font-size="9" font-weight="bold" fill="#5cc99e">Z</text>
    <!-- Hotbar: sword -->
    <g v-else-if="name === 'sword'">
      <rect x="7.3" y="1" width="1.4" height="8" fill="#cfe8ff" />
      <path d="M5.5 8.2h5l-1 1.3h-3z" fill="#7fb8ff" />
      <rect x="6" y="9.5" width="4" height="1.4" rx="0.4" fill="#9a6b3f" />
      <rect x="7.3" y="11" width="1.4" height="3.5" rx="0.5" fill="#5a3d24" />
      <circle cx="8" cy="3" r="2.4" fill="#7fb8ff" opacity="0.35" />
    </g>
    <!-- Hotbar: dash boot -->
    <g v-else-if="name === 'boot'">
      <path d="M5 3h3v4.5l3 1.5v2H4.5C4 11 4 9.5 4 9V3Z" fill="#7a5230" />
      <rect x="4" y="10" width="8" height="1.6" rx="0.6" fill="#4a3219" />
      <path d="M1 6h2.2M0.5 8h2.6M1.5 4h2" stroke="#cfe8ff" stroke-width="1" stroke-linecap="round" />
    </g>
    <!-- Hotbar: healing potion -->
    <g v-else-if="name === 'potion'">
      <path d="M6 2h4v2.2l1.2 1.6c.5.7.8 1.5.8 2.4V12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.2c0-.9.3-1.7.8-2.4L6 4.2V2Z" fill="#3a3a3a" />
      <path d="M5 9.5h6V12a1.4 1.4 0 0 1-1.4 1.4H6.4A1.4 1.4 0 0 1 5 12V9.5Z" fill="#d64545" />
      <rect x="5.5" y="1" width="5" height="1.4" rx="0.4" fill="#9aa0a6" />
    </g>
    <!-- Extraction archway -->
    <g v-else-if="name === 'archway'">
      <path d="M3 14V7a5 5 0 0 1 10 0v7" fill="none" stroke="#c9a35c" stroke-width="1.6" />
      <rect x="3" y="13" width="2" height="1.5" fill="#c9a35c" />
      <rect x="11" y="13" width="2" height="1.5" fill="#c9a35c" />
    </g>
    <!-- Extraction direction arrow -->
    <path v-else-if="name === 'arrow'" fill="#f2c14e" d="M2 8h9l-3-3 1.4-1.4L15 9.6 9.4 15.4 8 14l3-3H2Z" />
    <!-- Resource: wood -->
    <g v-else-if="name === 'wood'">
      <rect x="2" y="4" width="12" height="3" rx="1" fill="#9a6b3f" />
      <rect x="2" y="9" width="12" height="3" rx="1" fill="#7a5230" />
      <circle cx="4" cy="5.5" r="0.7" fill="#5a3d24" />
      <circle cx="4" cy="10.5" r="0.7" fill="#4a3219" />
    </g>
    <!-- Resource: stone -->
    <path v-else-if="name === 'stone'" fill="#a8a8a8" d="M3 9 5 4h6l2 5-2 4H5Z" />
    <!-- Resource: raw meat -->
    <path
      v-else-if="name === 'raw_meat'"
      fill="#c43f5e"
      d="M9.5 2c1.9 0 3.5 1.6 3.5 3.5 0 1.1-.5 2.1-1.4 2.8L6.4 13.5c-1 1-2.7 1-3.7 0l-.2-.2c-1-1-1-2.7 0-3.7l5.2-5.2c-.2-.7.1-1.5.6-2 .3-.3.7-.4 1.2-.4Z"
    />
    <!-- Resource: unknown relic -->
    <path
      v-else-if="name === 'relic'"
      fill="#b15ce0"
      d="M8 1 10 6h5l-4 3.5 1.5 5.5L8 11.8 3.5 15 5 9.5 1 6h5Z"
    />
    <!-- Default fallback -->
    <rect v-else x="3" y="3" width="10" height="10" rx="2" fill="#888" />
  </svg>
</template>

<style scoped>
.icon {
  display: block;
  flex-shrink: 0;
}
</style>
