//Selección de los elementos del html
const d = document
$table = d.querySelector(".crud-table")
$form = d.querySelector(".crud-form")
$template = d.getElementById("crud-template").content
$fragment = d.createDocumentFragment()
$title = d.querySelector(".crud-title")


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

let uno = 0
let dos = 4
let noMasAdelante = false
if(window.localStorage.getItem('unoVuelo') == null) {
    window.localStorage.setItem('unoVuelo', uno);
}
if(window.localStorage.getItem('dosVuelo') == null) {
    window.localStorage.setItem('dosVuelo', dos);
}


function adelante() {
  if(noMasAdelante) {

  } else {
    uno =  parseInt(window.localStorage.getItem('unoVuelo'))
    dos = parseInt(window.localStorage.getItem('dosVuelo')) 
    
    window.localStorage.setItem('unoVuelo', uno + 4);
    window.localStorage.setItem('dosVuelo', dos + 4);
    location.reload()
  }
  }
  
  function atras() {
  if(window.localStorage.getItem('unoVuelo') != 0) {
      uno =  parseInt(window.localStorage.getItem('unoVuelo'))
      dos = parseInt(window.localStorage.getItem('dosVuelo')) 

      window.localStorage.setItem('unoVuelo', uno - 4);
      window.localStorage.setItem('dosVuelo', dos - 4);
      location.reload()
   }
  
  }


  const getVuelos = async () => {
    try {
    let space = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '
    let spacex = '\xa0 '
      let res = await fetch("http://localhost:3000/Vuelos")
        json = await res.json()
  
        let respuesta = await fetch("http://localhost:3000/Funcionarios")
        jason = await respuesta.json()
  
      if (!res.ok) throw { status: res.status, statusText: res.statusText }

     json.sort((a,b) => {
        if (a.Arribo > b.Arribo) {
          return 1;
        }
        if (a.Arribo < b.Arribo) {
          return -1;
        }
        
        return 0;
      })  

      if(json.slice(parseInt(window.localStorage.getItem('unoVuelo')),parseInt(window.localStorage.getItem('dosVuelo'))).length < 4) {
         noMasAdelante = true
      } else {
        noMasAdelante = false
      }

      json.slice(parseInt(window.localStorage.getItem('unoVuelo')),parseInt(window.localStorage.getItem('dosVuelo'))).forEach(el => {
        $template.querySelector(".title").textContent = 'Vuelo: ' + space + el.Nombre + space + el.Arribo + " x " + el.Partida
        $template.querySelector(".edit").dataset.id = el.id
        $template.querySelector(".duplicar").dataset.id = el.id
        $template.querySelector(".edit").dataset.nombre = el.Nombre
        $template.querySelector(".edit").dataset.arribo = el.Arribo
        $template.querySelector(".edit").dataset.partida = el.Partida
        $template.querySelector(".agregar").dataset.id = el.id
        $template.querySelector(".delete").dataset.titulo = 'Vuelo: ' + spacex + el.Nombre + spacex + el.Arribo + " x " + el.Partida
        $template.querySelector(".delete").dataset.id = el.id
        $template.querySelector(".enc").textContent = ""
        $template.querySelector(".op").textContent = ""
        $template.querySelector(".micro").textContent = ""
        $template.querySelector(".camion").textContent = ""
        $template.querySelector(".limp").textContent = ""
        $template.querySelector(".cinta").textContent = ""
        $template.querySelector(".checkin").textContent = ""
        if(el.Cargos && el.Funcionarios) {

          el.Cargos.filter((cargo) => cargo.trabajo == "ENC").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".enc").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "ENC").map((elements) => elements.codigo) 
            }
          } )      
          el.Cargos.filter((cargo) => cargo.trabajo == "OP").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".op").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "OP").map((elements) => elements.codigo) 
            }
          } )      
          el.Cargos.filter((cargo) => cargo.trabajo == "MICRO").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".micro").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "MICRO").map((elements) => elements.codigo) 
            }
          } )  
          el.Cargos.filter((cargo) => cargo.trabajo == "CAMION").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".camion").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "CAMION").map((elements) => elements.codigo) 
            }
          } )       
          el.Cargos.filter((cargo) => cargo.trabajo == "LIMP").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".limp").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "LIMP").map((elements) => elements.codigo) 
            }
          } )      
          el.Cargos.filter((cargo) => cargo.trabajo == "CINTA").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".cinta").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "CINTA").map((elements) => elements.codigo) 
            }
          } )      
          el.Cargos.filter((cargo) => cargo.trabajo == "CHECKIN").map((elements) => elements.codigo).forEach((codigo) => {
            if(el.Funcionarios.includes(codigo)) {
              $template.querySelector(".checkin").textContent = el.Cargos.filter((cargo) => cargo.trabajo == "CHECKIN").map((elements) => elements.codigo) 
            }
          } )      
          
        }
     

        let $clone = d.importNode($template, true)
        $fragment.appendChild($clone)
 
  
      $table.appendChild($fragment)

      })
  
      
    } catch (err) {
      let message = err || "Ocurrió un error al mostrar"
      $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
  }
d.addEventListener("DOMContentLoaded", getVuelos)


//A través del método POST creamos un nuevo funcionario
d.addEventListener("submit", async e => {

  if (e.target === $form) {
    e.preventDefault()

  if (!e.target.id.value) {
    try {
        let options = {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            Nombre: e.target.nombre.value,
            Arribo: e.target.arribo.value,
            Partida: e.target.partida.value,
        })}
        
        res = await fetch("http://localhost:3000/Vuelos", options)
        
        json = await res.json()
       
  
        if (!res.ok) throw { status: res.status, statusText: res.statusText }
        location.reload()
  
        } catch (err) {
          let message = err || "Ocurrió un error al publicar"
          $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }}

//A través del método PUT modificamos un funcionario
else {
    try {
    let options = {
    method: "PATCH",
    headers: { "Content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      Nombre: e.target.nombre.value,
      Arribo: e.target.arribo.value,
      Partida: e.target.partida.value,
    })}

    res = await fetch(`http://localhost:3000/Vuelos/${e.target.id.value}`, options)
    json = await res.json()

    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    location.reload()

    } catch (err) {
        let message = err || "Ocurrió un error al modificar"
        $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }}}

})

d.addEventListener("click", async e => {
  //Si el evento click coincide con editar, se editar
if (e.target.matches(".edit")) {
    $title.textContent = "Editar Vuelo" 
    $form.id.value = e.target.dataset.id
    $form.nombre.value = e.target.dataset.nombre
    $form.arribo.value = e.target.dataset.arribo
    $form.partida.value = e.target.dataset.partida
    window.scroll(0, 0)
    }


//Si el evento click coincide con eliminar, se elimina
if (e.target.matches(".delete")) {

  swalWithBootstrapButtons.fire({
    title: `¿Estás seguro de que quieres eliminar el ${e.target.dataset.titulo}?`,
    text: "No podrás revertirlo!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancelar!',
    confirmButtonText: 'Si, elimínalo!',
    reverseButtons: true
  }).then(async(result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Borrado',
        `${e.target.dataset.titulo} borrado con éxito`,
        'success'
      )
      try {
        let options = {
        method: "DELETE",
        headers: { "Content-type": "application/json; charset=utf-8" }
        }
        
        res = await fetch(`http://localhost:3000/Vuelos/${e.target.dataset.id}`, options)
        json = await res.json()
    
        if (!res.ok) throw { status: res.status, statusText: res.statusText }
        location.reload()
        } catch (err) {
            let message = err || "Ocurrió un error al borrar"
            alert(`Error ${err.status}: ${message}`)
        }
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        `El vuelo ${e.target.dataset.titulo} sigue estando`,
        'error'
      )
    }
  })
      }

if (e.target.matches(".agregar")) {      
    window.location.href = "../agregarfuncionarios/agregarfuncionarios.html?id=" + e.target.dataset.id ;      
}

if (e.target.matches(".duplicar")) {

  let response = await fetch("http://localhost:3000/Vuelos/" + e.target.dataset.id)
  jeison = await response.json()

  console.log(jeison)

      try {
      let options = {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            Nombre: jeison.Nombre,
            Arribo: jeison.Arribo,
            Partida: jeison.Partida,
            Funcionarios: jeison.Funcionarios,
            Cargos: jeison.Cargos
        })}
        
      
      res = await fetch(`http://localhost:3000/Vuelos/`, options)
      json = await res.json()
  
      if (!res.ok) throw { status: res.status, statusText: res.statusText }
      location.reload()
      } catch (err) {
          let message = err || "Ocurrió un error al duplicar"
          alert(`Error ${err.status}: ${message}`)
      }}

})



