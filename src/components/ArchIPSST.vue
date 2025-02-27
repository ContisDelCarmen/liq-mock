<script>
import { useFilterStore } from '@/stores/filterStore'
import { useEndPoints } from '@/composables/useEndPoints'
import { useFetch } from '@/composables/useFetch'

const { apiBase } = useEndPoints()

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(
    () =>
      `${apiBase.value}/api/view/archivoIPSST?${getId()}&sort={"Cadena":"asc"}`
  )
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)
</script>

<template>
  <v-container>
    <RepoHeader title="Archivo IPSST" :subtitle="store.liqString">
      <v-btn color="primary" @click="handleDownload" :disabled="!data">Descargar</v-btn>
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
