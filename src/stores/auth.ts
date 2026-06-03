import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Usuario, TipoUsuario } from '../api/auth'
 
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const usuario = ref<Usuario | null>(null)
 
  const estaAutenticado = computed(() => !!accessToken.value)
 
  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }
 
  const setUsuario = (dados: Usuario) => {
    usuario.value = dados
  }
 
  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    usuario.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
 
  return {
    accessToken,
    refreshToken,
    usuario,
    estaAutenticado,
    setTokens,
    setUsuario,
    logout,
  }
})
 
