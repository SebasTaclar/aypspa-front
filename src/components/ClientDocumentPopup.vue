<template>
  <div v-if="visible" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <button class="close-button" @click="closePopup">X</button>
      <img v-if="imageSrc" :src="imageSrc" alt="Client Image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ClientDocumentPopUp',
  props: {
    imageSrc: {
      type: String,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closePopup() {
      this.$emit('close');
    },
  },
})
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
