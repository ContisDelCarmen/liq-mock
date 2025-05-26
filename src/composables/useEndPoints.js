import { ref } from 'vue'
import endPoints from '../endPoints.json'

const apiBoletas = ref()
const apiBase = ref()
const apiSp = ref()
const env = ref()

export function useEndPoints() {
  function setEndPoint(ep) {
    apiBase.value = ep.base
    apiBoletas.value = ep.boletas
    apiSp.value = ep.sp
    env.value = ep.titulo
    console.log(apiBase.value)
  }
  return {
    apiBase,
    apiBoletas,
    apiSp,
    setEndPoint,
    env,
    endPoints,
  }
}