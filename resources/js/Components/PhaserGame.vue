<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { ensurePhaserGame, destroyPhaserGame, getPhaserGame } from '@/game/main';
import { EventBus } from '@/game/EventBus';
import { submitScore } from '@/game/api';

const containerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const el = containerRef.value;
  if (el) {
    el.id = 'game-container';
    
    // Clear any existing content (just in case)
    el.innerHTML = '';

    // Ensure only one game instance exists
    const existingGame = getPhaserGame();
    if (!existingGame || !existingGame.canvas) {
      ensurePhaserGame(el);
    } else {
      // Move existing canvas to current container
      if (existingGame.canvas.parentElement !== el) {
        el.appendChild(existingGame.canvas);
      }
    }
  }

  const submitListener = async (score: number) => {
    const name = window.prompt('Enter your name', localStorage.getItem('luksongbaka_name') || '') || 'Player';
    localStorage.setItem('luksongbaka_name', name);
    
    try {
      const result = await submitScore({ name, score });
      if (result.success) {
        console.log('Score submitted successfully:', result.message);
        // You could show a success notification here
      } else {
        console.error('Score submission failed:', result.message);
        alert('Failed to submit score: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Score submission error:', error);
      alert('Failed to submit score. Please check your connection.');
    }
  };

  EventBus.on('submit-score', submitListener);

  onBeforeUnmount(() => {
    EventBus.off('submit-score', submitListener);
    // Optional: destroy game when component unmounts (if you want to)
    destroyPhaserGame();
  });
});
</script>

<template>
  <div ref="containerRef" class="game-container" style="width: 1024px; height: 720px;"></div>
</template>