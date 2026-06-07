import api from "./config";

export const getBabas = () => {
  return api.get('/perfil-baba/')
}

export const getBaba = (id: number) => {
  return api.get(`/perfil-baba/${id}/`)
}

export const updateBaba = (id: number, data: object) => {
  return api.put(`/perfil-baba/${id}/`, data)
}

export const deleteBaba = (id: number) => {
  return api.delete(`/perfil-baba/${id}/`)
}