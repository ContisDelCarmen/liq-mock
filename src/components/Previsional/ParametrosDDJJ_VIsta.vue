<script setup>
import { ref } from 'vue'
import { getVto, getVtoActual, getFechaToAPIFromMMYYYY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'

const props = defineProps(['Registro', 'cerrar', 'funcion'])
let registroOrigen = props.Registro
let registroActual = ref({})

const form = ref(null)
const formOK = ref(false)

const periodo = ref(getVtoActual())
const periodo_hasta = ref(null)

const registroVacio = ref({
  APJUB_MIN: 0,
  APJUB_MAX: 0,
  APJUB_PORC_REP: 11,
  CONTJUB_PORC: 10.17,
  APOS_MIN: 0,
  APOS_MAX: 0,
  CONTOS_MIN: 0,
  ID: 0
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  periodo.value = getVto(registroOrigen.PERIODO)
  periodo_hasta.value = getVto(registroOrigen.VTO)
} else {
  registroActual.value = registroVacio.value
}

const mostrarAlert = ref(false)

let mensajeError = ref('')

async function grabaRegistro() {
  const isValid = await form.value.validate()

  if (!isValid) {
    return
  }
  if (formOK.value === false) {
    return
  }
  mostrarAlert.value = false
  if (!validarRegistro()) {
    mostrarAlert.value = true
    return
  }
  let vto = ''
  if (periodo_hasta.value != null) {
    if (periodo_hasta.value.length > 0) vto = getFechaToAPIFromMMYYYY(periodo_hasta.value)
  }

  let registroGrabar = {
    vPERIODO: getFechaToAPIFromMMYYYY(periodo.value),
    vPERIODO_HASTA: vto,
    vAPJUB_MIN: registroActual.value.APJUB_MIN,
    vAPJUB_MAX: registroActual.value.APJUB_MAX,
    vAPJUB_PORC: registroActual.value.APJUB_PORC_REP,
    vCONTJUB_MAX: registroActual.value.CONTJUB_MAX,
    vCONTJUB_PORC: registroActual.value.CONTJUB_PORC,
    vAPOS_MIN: registroActual.value.APOS_MIN,
    vAPOS_MAX: registroActual.value.APOS_MAX,
    vCONTOS_MIN: registroActual.value.CONTOS_MIN,
    vCONTOS_MAX: registroActual.value.CONTOS_MAX
  }
  if (registroActual.value.ID !== 0) {
    registroGrabar = {
      vID: registroActual.value.ID,
      ...registroGrabar
    }
  }
  console.log(registroGrabar)
  let grabarOk = await props.funcion(registroGrabar, registroActual.value.ID)

  if (grabarOk) {
    props.cerrar()
  } else {
    mensajeError.value = 'No se pudieron grabar los datos'
    mostrarAlert.value = true
  }
}

function validarRegistro() {
  return true
}
</script>

<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="formOK">
        <v-card-title>Parámetros de DDJJ</v-card-title>
        <v-alert
          v-model="mostrarAlert"
          border="start"
          close-label="Close Alert"
          color="error"
          icon="$error"
          closable
        >
          {{ mensajeError }}
        </v-alert>
        <v-card-text>
          <v-container style="height: 60vh; overflow-y: scroll">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="periodo"
                  hide-details="auto"
                  label="desde"
                  :rules="[...rules.mmyyyy, (val) => rules.longitudEntre(val, 1, 7)]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="periodo_hasta"
                  hide-details="auto"
                  label="hasta"
                  :rules="rules.mmyyyy"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APJUB_MIN"
                  hide-details="auto"
                  label="Ap. Jub. Mín"
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APJUB_MAX"
                  hide-details="auto"
                  label="Ap. Jub. Máx."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APJUB_PORC_REP"
                  hide-details="auto"
                  label="Ap. Jub. %"
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CONTJUB_MAX"
                  hide-details="auto"
                  label="Contr. Jub. Máx."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CONTJUB_PORC"
                  hide-details="auto"
                  label="Contr. Jub. Porc"
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APOS_MIN"
                  hide-details="auto"
                  label="Ap. OS. Mín."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APOS_MAX"
                  hide-details="auto"
                  label="Ap. Jub. Máx."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CONTOS_MIN"
                  hide-details="auto"
                  label="Contr. OS. Mín."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CONTOS_MAX"
                  hide-details="auto"
                  label="Contr. Jub. Máx."
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" elevation="3" outlined value="grabar" @click="grabaRegistro()"
            >Grabar</v-btn
          >
          <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
