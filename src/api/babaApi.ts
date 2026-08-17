import api from "./config";

export const getBabas = () => {
  return api.get('/perfil-baba/')
}

export const getBabasCompletas = () => {
  return api.get('/perfil-baba/completas/')
}

export const getBaba = (id: number) => {
  return api.get(`/perfil-baba/${id}/`)
}

export const updateBaba = (id: number, data: object) => {
  return api.put(`/perfil-baba/${id}/`, data)
}

export const createBaba = (data: object) => {
  return api.post('/perfil-baba/', data)
}

export const deleteBaba = (id: number) => {
  return api.delete(`/perfil-baba/${id}/`)
}