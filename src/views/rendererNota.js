/**
 * 
 * 
 */

const foco = document.getElementById('inputNote')
// alterar as propriedades do documento html ao iniciar a aplicaçao
document.addEventListener("DOMContentLoaded", () => {
foco.focus()
})

//passo 1 do fluxo
let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

//====================================================
// CRUD create-inicio=================================
frmNote.addEventListener('submit', async(event) =>{
    //evitar o comportamento padrao (carregar a pagina)
    event.preventDefault()
    //IMPORTANTE (teste de recebimento dos dados do form passo 1)
    console.log(note.value, color.value)
    //criar um obkjeto para enviar ao main.js os dados da nota
    const stickyNote = {
        textoNote: note.value,
        colorNote: color.value
    }
    //enviar o objeto para o main.js
    api.createNote(stickyNote)
})



// CRUD create-fim-=======================================
//====================================================
