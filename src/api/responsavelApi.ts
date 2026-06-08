import api from "./config";

export const getResponsaveis = () => {
  return api.get('/perfil-pai/')
}

export const getResponsavel = (id: number) => {
  return api.get(`/perfil-pai/${id}/`)
}

export const createResponsavel = (data: object) => {
  return api.post('/perfil-pai/', data)
}

export const updateResponsavel = (id: number, data: object) => {
  return api.put(`/perfil-pai/${id}/`, data)
}

export const deleteResponsavel = (id: number) => {
  return api.delete(`/perfil-pai/${id}/`)
}