import { defineStore } from "pinia";
import { ref } from "vue";
import * as babaApi from '@/api/babaApi'

interface BabaInterface{
    id: number,
    usuario: {
        id: number,
        "password": string,
        "last_login": string | null,
        "is_superuser": boolean,
        "username": string,
        "first_name": string | null,
        "last_name": string | null,
        "primeiro_nome": string | null,
        "ultimo_nome": string | null,
        "email": string | null,
        "is_staff": boolean,
        "is_active": boolean,
        "date_joined": string,
        "tipo": string,
        "foto": {
            file: string | undefined
        },
        "telefone": string | null,
        "groups": [],
        "user_permissions": []
    },
    experiencia_anos: number,
    descricao: string | null,
    disponivel: boolean,
    valor_hora: number | null,
    habilidades: string | null,
    dtnasc: string | null,
    formacao: string | null,
    sobre: string | null
}

export const useBabaStore = defineStore('babaStore', () => {

    const babas = ref<BabaInterface[]>([])

    async function getBabas() {
        try {
            const response = await babaApi.getBabasCompletas()
            babas.value = response.data.results ?? response.data
            console.log('Babas')
            console.log(response.data.results)
        } catch (error) {
            console.log(error)
        }
    }   

    return {
        babas,
        getBabas
    }
}
)