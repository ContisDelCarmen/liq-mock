<script setup>
import PersonasList from '@/components/Agentes/PersonasList.vue'
import CargaFamiliarList from '@/components/Agentes/CargaFamiliarList.vue'
import { ref } from 'vue'

const persona = {
  ID: 337,
  DNI: 12345678,
  APELLIDOYNOMBRE: 'NOMBRE DE LA PERSONA'
}

const personaEdicion = ref(null)
const tipoEdicion = ref(0)
const titulo = ref('Listado de hojas')

function setPersonaEdicion(persona, tipo) {
  personaEdicion.value = persona
  tipoEdicion.value = tipo

  if (persona !== null && tipo == 1) {
    titulo.value =
      'Editar Carga familiar de : ' +
      persona.DOCUMENTO +
      ' - ' +
      persona.APELLIDO +
      ', ' +
      persona.NOMBRE
  } else {
    titulo.value = 'Listado de personas'
  }
}
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>{{ titulo }}</h3>
    </v-row>
    <v-row>
      <CargaFamiliarList
        v-if="tipoEdicion == 1"
        :personaEditar="personaEdicion"
        :setPersonaEdicion="setPersonaEdicion"
      ></CargaFamiliarList>
      <PersonasList v-if="tipoEdicion == 0" :setPersonaEdicion="setPersonaEdicion"></PersonasList>
    </v-row>
  </v-container>
</template>
