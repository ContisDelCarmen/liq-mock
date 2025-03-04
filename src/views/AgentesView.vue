<script setup>
import PersonasList from '@/components/Agentes/PersonasList.vue'
import CargaFamiliarList from '@/components/Agentes/CargaFamiliarList.vue'
import { ref } from 'vue'

const persona = {
  ID: 337,
  DNI: 12345678,
  APELLIDOYNOMBRE: 'NOMBRE DE LA PERSONA'
}

const personaEdicion = ref(persona)
const titulo = ref('Listado de hojas')

function setPersonaEdicion(persona) {
  personaEdicion.value = persona
  if (persona !== null) {
    titulo.value = 'Editar registros de Hoja: ' + persona.ID
  } else {
    titulo.value = 'Listado de hojas'
  }
}
</script>

<template>
  <CargaFamiliarList
    :personaEditar="persona"
    :setPersonaEdicion="setPersonaEdicion"
  ></CargaFamiliarList>
</template>
