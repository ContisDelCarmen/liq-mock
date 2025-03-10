<script setup>
import { ref } from 'vue'
import RepoHeader from './RepoHeader.vue'
import { useFilterStore } from '@/stores/filterStore'
import { useEndPoints } from '@/composables/useEndPoints'
import { useFetch } from '@/composables/useFetch'

const { apiBase } = useEndPoints()

const store = useFilterStore()

function printData() {
  let largeString = ""
  for (let index = 0; index < data.value.length; index++) {
    const element = data.value[index];
    
    largeString+= element.CADENA + '\n'
  }

  console.log(largeString )
  downloadTxt(largeString,data.value[0].NOMBREARCHIVO)
}

const downloadTxt = (contenido, nombre) => {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

function useLiqBoletas(getId) {
  return useFetch(() => `${apiBase.value}/api/view/archivoIPSST?${getId()}`)
}

const { data, error, isPending } = useLiqBoletas(() => store.filterString)

const headers = [
  {
    title: 'CADENA',
    align: 'start',
    key: 'CADENA'
  }
]
</script>

<template>
 <v-container>
   <RepoHeader title="Archivo IPSST" :subtitle="store.liqString">
      <v-btn color="primary" :disabled="!data" @click="printData" >Descargar</v-btn>
    </RepoHeader>
    <v-row>
      <div v-if="isPending">loading...</div>
      <v-data-table
        v-else-if="data"
        class="text-caption"
        hover
        density="compact"
        :items="data"
        :headers="headers"
      >
      </v-data-table>      
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>

    </v-row>
  </v-container> 
</template>
