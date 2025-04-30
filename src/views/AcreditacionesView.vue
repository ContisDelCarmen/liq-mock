<script setup>
import LiqInputPanel from '@/components/LiqInputPanel.vue'
import ArchAcred from '@/components/ArchAcred.vue'
import ResumenAcred from '@/components/ResumenAcred.vue'
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>Archivos</h3>
    </v-row>
    <v-row>
      <LiqInputPanel :tipoliq=false :nroadi=false ></LiqInputPanel>
    </v-row>
    <v-row>
      <ResumenAcred></ResumenAcred>
    </v-row>
    <v-row>
      <ArchAcred></ArchAcred>
    </v-row>
  </v-container>
</template>