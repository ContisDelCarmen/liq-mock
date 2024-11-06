<script setup>
import { ref } from 'vue'
import { leerDatos, ejecutarSP } from './llamadaAPI'
import { financial, getFechaToAPIFromMMYYYY, getPeriodoFromMMYYYY } from '@/utils/formatos'

const props = defineProps(['periodo'])
console.log('periodo', props.periodo)
const d = props.periodo.split('/')
const periodoId = parseInt(d[1]) * 100 + parseInt(d[0])
console.log('PeriodoId', periodoId)

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null
const lecturaListaRegs = ref(true)
const registroDJ = ref(null)

// alerta de grabación o error
const mostrarAlert = ref(false)
const alertMensaje = ref(null)
const alertTipo = ref(null)

async function leerListaRegs() {
  isPending.value = true
  const { datos, operacionOk } = await leerDatos('djPrevResumenDJ?Id=' + periodoId)

  data.value = datos
  lecturaListaRegs.value = operacionOk
  isPending.value = false

  if (data.value !== null) {
    registroDJ.value = data.value[0]
  } else {
    registroDJ.value = null
  }
}

async function leerTXT() {
  isPending.value = true
  const { datos, operacionOk } = await leerDatos(
    'txt/djPrevTxtDDJJ?PeriodoDJ=' + getPeriodoFromMMYYYY(props.periodo)
  )
  console.log(datos)

  lecturaListaRegs.value = operacionOk
}

async function procesaDDJJ() {
  isPending.value = true
  let url = 'sp/djPrevCargaResumen'

  const item = { PeriodoDDJJ: getFechaToAPIFromMMYYYY(props.periodo) }
  console.log(item)
  let resultado = { valorError: 0, valorSalida: 0 }
  resultado = await ejecutarSP(url, item)
  console.log(resultado)
  if (resultado.valorSalida != 0) {
    mostrarAlert.value = true
    alertMensaje.value = 'No se pudo generar el resumen. No se actualizaron los datos'
    alertTipo.value = 'error'
    isPending.value = false
    return
  }
  url = 'sp/djPrevCargaDDJJ'
  resultado = await ejecutarSP(url, item)
  console.log(resultado)
  if (resultado.valorSalida != 0) {
    mostrarAlert.value = true
    alertMensaje.value = 'No se pudo generar la DDJJ. No se actualizaron los datos'
    alertTipo.value = 'error'
    isPending.value = false
    return
  }

  await leerListaRegs()
  //alertMensaje.value = 'Se agregó la liquidación'
  //alertTipo.value = 'success'
  //mostrarAlert.value = true
  mostrarAlert.value = true
  alertMensaje.value = 'Se actualizaron los datos de DDJJ'
  alertTipo.value = 'success'

  return 'OK'
}

// Método para descargar el archivo
async function downloadFile() {
  // Realiza la llamada a la API usando fetch (o axios si prefieres)
  const url =
    'http://www.serverburru2.duckdns.org:3005/api/txt/djPrevTxtDDJJ?PeriodoDJ=' +
    getPeriodoFromMMYYYY(props.periodo)
  await fetch(url, {
    method: 'GET',
    headers: {
      // Asegúrate de que este encabezado sea compatible con la API
      'Content-Type': 'text/plain'
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo')
      }
      return response.blob() // Convierte la respuesta a blob para el archivo
    })
    .then((blob) => {
      // Crea una URL de objeto para el blob
      const url = window.URL.createObjectURL(blob)
      // Crea un enlace para descargar el archivo
      const a = document.createElement('a')
      a.href = url
      a.download = 'ddjj_' + props.periodo + '.txt' // Nombre con el que se descargará el archivo
      document.body.appendChild(a)
      a.click() // Simula el clic para iniciar la descarga
      a.remove() // Elimina el enlace del DOM
      window.URL.revokeObjectURL(url) // Limpia la URL creada
    })
    .catch((error) => {
      console.error('Error al descargar el archivo:', error)
    })
}

leerListaRegs()
</script>

<template>
  <v-container>
    <v-row>
      <v-btn color="primary" elevation="3" class="mx-2" @click="procesaDDJJ()">Procesar DDJJ</v-btn>
      <v-btn
        v-if="registroDJ != null"
        color="primary"
        elevation="3"
        class="mx-2"
        @click="downloadFile()"
        >Genera TXT</v-btn
      >
      <v-btn
        v-if="registroDJ != null"
        color="primary"
        elevation="3"
        class="mx-2"
        @click="procesaDDJJ()"
        >Genera PDF</v-btn
      >
    </v-row>
    <v-row>
      <v-alert
        v-model="mostrarAlert"
        border="start"
        close-label="Close Alert"
        :color="alertTipo"
        :icon="'$' + alertTipo"
        closable
      >
        {{ alertMensaje }}
      </v-alert>
    </v-row>
  </v-container>
  <v-container>
    <div v-if="isPending">loading...</div>
    <div v-else-if="!lecturaListaRegs">Sin datos para mostrar</div>
    <div v-else-if="data">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left text-h6" colspan="2">Totales de cálculo</th>
            <th style="width: 30px"></th>
            <th class="text-left text-h6" colspan="2">Valores para DDJJ</th>
          </tr>
          <tr>
            <th class="text-left">Item</th>
            <th class="text-left">Valor</th>
            <th></th>
            <th class="text-left">Item</th>
            <th class="text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cant. Agentes</td>
            <td class="text-right">{{ registroDJ.CANTAGENTES }}</td>
            <td></td>
            <td>Cant. Agentes</td>
            <td class="text-right">{{ registroDJ.CANTAGENTES }}</td>
          </tr>
          <tr>
            <td>Haberes C/Aporte</td>
            <td class="text-right">{{ financial(registroDJ.HABCONAPORTE) }}</td>
            <td></td>
            <td>Rem. Total</td>
            <td class="text-right">{{ financial(registroDJ.REMTOTAL) }}</td>
          </tr>
          <tr>
            <td>Remuneración Actual</td>
            <td class="text-right">{{ financial(registroDJ.REMACTUAL) }}</td>
            <td></td>
            <td>Rem SS</td>
            <td class="text-right">{{ financial(registroDJ.REMSS) }}</td>
          </tr>
          <tr>
            <td>Remuneración Atrasada</td>
            <td class="text-right">{{ financial(registroDJ.REMATRASADA) }}</td>
            <td></td>
            <td>Rem 02</td>
            <td class="text-right">{{ financial(registroDJ.REM02) }}</td>
          </tr>
          <tr>
            <td>Remuneración Excedente</td>
            <td class="text-right">{{ financial(registroDJ.REMEXCEDENTE) }}</td>
            <td></td>
            <td>Rem 03</td>
            <td class="text-right">{{ financial(registroDJ.REM03) }}</td>
          </tr>
          <tr>
            <td>Aporte Jub.</td>
            <td class="text-right">{{ financial(registroDJ.APORTEJUBILATORIO) }}</td>
            <td></td>
            <td>Rem 04</td>
            <td class="text-right">{{ financial(registroDJ.REM04) }}</td>
          </tr>
          <tr>
            <td>Patronal Jub.</td>
            <td class="text-right">{{ financial(registroDJ.PATRONALJUBILATORIO) }}</td>
            <td></td>
            <td>Rem 05</td>
            <td class="text-right">{{ financial(registroDJ.REM05) }}</td>
          </tr>
          <tr>
            <td>Fecha de Proceso</td>
            <td class="text-right">{{ financial(registroDJ.FECHARESUMEN) }}</td>
            <td></td>
            <td>Rem 06</td>
            <td class="text-right">{{ financial(registroDJ.REM06) }}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Rem 07</td>
            <td class="text-right">{{ financial(registroDJ.REM07) }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>
</template>
