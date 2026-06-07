import { defineStore } from "pinia";
import { ref } from "vue";
import * as babaApi from '@/api/babaApi'


interface responsavelinterface{
 id: number,
    usuario: {
        id: number,
        numero_filhos: number,
        endereco: string
    }}

    export const  useBabaStore =defineStore('babastore', () => {

        const responsavel = ref<responsavelinterface[]>([])

         async function getBabas() {
               try {
                   const response = await babaApi.getBabas()
                   responsavel.value = response.data.results
                   console.log('Responsavel')
                   console.log(response.data.results)
               } catch (error) {
                   console.log(error)
               }
           }
       
           return {
               responsavel,
               getBabas
           }
       })