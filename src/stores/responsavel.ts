import { defineStore } from "pinia";
import { ref } from "vue";
import * as responsavelApi from '@/api/responsavelApi'

interface ResponsavelInterface {
  id: number
  usuario: number
  numero_filhos: number
  endereco: string
}

export const useResponsavelStore = defineStore('responsavelStore', () => {
  const responsavel = ref<ResponsavelInterface | null>(null)
  const carregando = ref(false)
  const erro = ref('')

  async function createResponsavel(dados: object) {
    carregando.value = true
    erro.value = ''
    try {
      const response = await responsavelApi.createResponsavel(dados)
      responsavel.value = response.data
      return response.data
    } catch (error: any) {
      erro.value = error.response?.data?.detail || 'Erro ao cadastrar responsável.'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function getResponsavel(id: number) {
    try {
      const response = await responsavelApi.getResponsavel(id)
      responsavel.value = response.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    responsavel,
    carregando,
    erro,
    createResponsavel,
    getResponsavel,
  }
})