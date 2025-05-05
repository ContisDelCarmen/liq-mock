<script setup>
import LiqInputPanel from '@/components/LiqInputPanel.vue'
//    <ResumenAcred></ResumenAcred>  <v-row><ResumenAcredDetalle></ResumenAcredDetalle> </v-row>

//import ResumenAcred from '@/components/ResumenAcred.vue'

//import ResumenAcredDetalle from '@/components/ResumenAcredDetalle.vue'

import ArchAcred from '@/components/ArchAcred.vue'

</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>Archivos</h3>
    </v-row>
    <v-row>
      <LiqInputPanel></LiqInputPanel>
    </v-row>
    <v-row>    <ArchAcred></ArchAcred>  </v-row>
  </v-container>
</template>