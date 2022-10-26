//Selección de los elementos del html
const d = document
$table = d.querySelector(".crud-table-encargados")
$form = d.querySelector(".crud-form")
$title = d.querySelector(".crud-title")
$template = d.getElementById("crud-template").content
$filtro = d.getElementById("filtro")
$fragment = d.createDocumentFragment()


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


let uno = 0
let dos = 10
if(window.localStorage.getItem('uno') == null) {
    window.localStorage.setItem('uno', uno);
}
if(window.localStorage.getItem('dos') == null) {
    window.localStorage.setItem('dos', dos);
}


function adelante() {
  if(noMasAdelante) {

  } else {
    uno =  parseInt(window.localStorage.getItem('uno'))
    dos = parseInt(window.localStorage.getItem('dos')) 
    
    window.localStorage.setItem('uno', uno + 10);
    window.localStorage.setItem('dos', dos + 10);
    location.reload()
  }

  }
  
  function atras() {
  if(window.localStorage.getItem('uno') != 0) {
      uno =  parseInt(window.localStorage.getItem('uno'))
      dos = parseInt(window.localStorage.getItem('dos')) 
      window.localStorage.setItem('uno', uno - 10);
      window.localStorage.setItem('dos', dos - 10);
      location.reload()
   }
  
  }

//Se muestra la tabla y a través de fetch traemos los datos de los funcionarios
const getAll = async () => {
    try {
      let res = await fetch("http://localhost:3000/Funcionarios")
        json = await res.json()

        let respuesta = await fetch("http://localhost:3000/Dia")
        jason = await respuesta.json()

      if (!res.ok) throw { status: res.status, statusText: res.statusText }

      let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
      let disponible 

      json.sort((a,b) => {
        if (a.HorarioEntrada > b.HorarioEntrada) {
          return 1;
        }
        if (a.HorarioEntrada < b.HorarioEntrada) {
          return -1;
        }
        
        return 0;
      })  

      if(json.slice(parseInt(window.localStorage.getItem('uno')),parseInt(window.localStorage.getItem('dos'))).length < 10) {
        noMasAdelante = true
     } else {
       noMasAdelante = false
     }
        
      json.slice(parseInt(window.localStorage.getItem('uno')),parseInt(window.localStorage.getItem('dos'))).forEach(el => {
        let horarioEntrada = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4))
        let horarioSalida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))

        if (horarioEntrada > horarioSalida) {
          horarioSalida.setDate(horarioSalida.getDate() +1)
        }

        let disponibilidad = "DESC"
        el.DiaSemana.forEach((dia) => {
          if(diaDeHoy == dia) {
            disponibilidad = "SI"
          } 
        })
      
      if(el.Disponibilidad == "BPS") {
        disponibilidad = "BPS"
      }
      disponible = disponibilidad
      el.Disponibilidad = disponible

        let diaSemana = []
        if(el.DiaSemana) {
          el.DiaSemana.forEach((dia) => {
            if(dia == 1) {
              dia = "Lu"
            } 
            if(dia == 2) {
              dia = "Ma"
            } 
            if(dia == 3) {
              dia = "Mi"
            } 
            if(dia == 4) {
              dia = "Ju"
            } 
            if(dia == 5) {
              dia = "Vi"
            } 
            if(dia == 6) {
              dia = "Sa"
            } 
            if(dia == 0) {
              dia = "Do"
            } 
            diaSemana.push(dia)
          })
        } else {
          diaSemana = el.DiaSemana
        }
        
        $template.querySelector(".codigo").textContent = el.Codigo
        $template.querySelector(".apellido").textContent = el.Apellido
        $template.querySelector(".telefono").textContent = el.Telefono
        $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".cargo").textContent = el.Cargo
        $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
        $template.querySelector(".diaSemana").textContent = diaSemana
        $template.querySelector(".edit").dataset.id = el.id
        $template.querySelector(".edit").dataset.codigo = el.Codigo
        $template.querySelector(".edit").dataset.apellido = el.Apellido
        $template.querySelector(".edit").dataset.telefono = el.Telefono
        $template.querySelector(".edit").dataset.horarioEntrada = el.HorarioEntrada
        $template.querySelector(".edit").dataset.horarioSalida = el.HorarioSalida
        $template.querySelector(".edit").dataset.cargo = el.Cargo
        $template.querySelector(".edit").dataset.disponibilidad = el.Disponibilidad
        $template.querySelector(".edit").dataset.diaSemana = el.DiaSemana
        $template.querySelector(".delete").dataset.apellido = el.Apellido
        $template.querySelector(".delete").dataset.codigo = el.Codigo
        $template.querySelector(".delete").dataset.id = el.id

        let $clone = d.importNode($template, true)
        $fragment.appendChild($clone)
      
      })

      $table.querySelector("tbody").appendChild($fragment)
    } catch (err) {
      let message = err || "Ocurrió un error al mostrar"
      $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
  }
d.addEventListener("DOMContentLoaded", getAll)


//A través del método POST creamos un nuevo funcionario
d.addEventListener("submit", async e => {

    if (e.target === $form) {
      e.preventDefault()

    if (!e.target.id.value) {
      let diaSemana = []
      if (e.target.diaSemana1.checked) {
        diaSemana.push(e.target.diaSemana1.value)
      }
      if (e.target.diaSemana2.checked) {
        diaSemana.push(e.target.diaSemana2.value)
      }
      if (e.target.diaSemana3.checked) {
        diaSemana.push(e.target.diaSemana3.value)
      }
      if (e.target.diaSemana4.checked) {
        diaSemana.push(e.target.diaSemana4.value)
      }
      if (e.target.diaSemana5.checked) {
        diaSemana.push(e.target.diaSemana5.value)
      }
      if (e.target.diaSemana6.checked) {
        diaSemana.push(e.target.diaSemana6.value)
      }
      if (e.target.diaSemana7.checked) {
        diaSemana.push(e.target.diaSemana7.value)
      }
      

        try {
        let options = {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            Codigo: e.target.codigo.value,
            Apellido: e.target.apellido.value,
            HorarioEntrada: e.target.horarioEntrada.value,
            HorarioSalida: e.target.horarioSalida.value,
            Cargo: e.target.cargo.value,
            Telefono: e.target.telefono.value,
            Disponibilidad: e.target.disponibilidad.value,
            DiaSemana: diaSemana
        })}
        
        res = await fetch("http://localhost:3000/Funcionarios", options)
        
        json = await res.json()
       

        if (!res.ok) throw { status: res.status, statusText: res.statusText }
        location.reload()

        } catch (err) {
          let message = err || "Ocurrió un error al publicar"
          $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }}

//A través del método PUT modificamos un funcionario
    else {

        let diaSemana = []
        if (e.target.diaSemana1.checked) {
          diaSemana.push(e.target.diaSemana1.value)
        }
        if (e.target.diaSemana2.checked) {
          diaSemana.push(e.target.diaSemana2.value)
        }
        if (e.target.diaSemana3.checked) {
          diaSemana.push(e.target.diaSemana3.value)
        }
        if (e.target.diaSemana4.checked) {
          diaSemana.push(e.target.diaSemana4.value)
        }
        if (e.target.diaSemana5.checked) {
          diaSemana.push(e.target.diaSemana5.value)
        }
        if (e.target.diaSemana6.checked) {
          diaSemana.push(e.target.diaSemana6.value)
        }
        if (e.target.diaSemana7.checked) {
          diaSemana.push(e.target.diaSemana7.value)
        }
      
      
        try {
        let options = {
        method: "PUT",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          Codigo: e.target.codigo.value,
          Apellido: e.target.apellido.value,
          HorarioEntrada: e.target.horarioEntrada.value,
          HorarioSalida: e.target.horarioSalida.value,
          Cargo: e.target.cargo.value,
          Telefono: e.target.telefono.value,
          Disponibilidad: e.target.disponibilidad.value,
          DiaSemana: diaSemana
        })}

        res = await fetch(`http://localhost:3000/Funcionarios/${e.target.id.value}`, options)
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
    $title.textContent = "Editar Funcionario" 
    $form.id.value = e.target.dataset.id
    $form.codigo.value = e.target.dataset.codigo
    $form.apellido.value = e.target.dataset.apellido
    $form.horarioEntrada.value = e.target.dataset.horarioEntrada
    $form.horarioSalida.value = e.target.dataset.horarioSalida
    $form.cargo.value = e.target.dataset.cargo
    $form.telefono.value = e.target.dataset.telefono
    $form.disponibilidad.value = e.target.dataset.disponibilidad
    $form.diaSemana1.checked = e.target.dataset.diaSemana.includes(1)
    $form.diaSemana2.checked = e.target.dataset.diaSemana.includes(2)
    $form.diaSemana3.checked = e.target.dataset.diaSemana.includes(3)
    $form.diaSemana4.checked = e.target.dataset.diaSemana.includes(4)
    $form.diaSemana5.checked = e.target.dataset.diaSemana.includes(5)
    $form.diaSemana6.checked = e.target.dataset.diaSemana.includes(6)
    $form.diaSemana7.checked = e.target.dataset.diaSemana.includes(0)
    window.scroll(0, 0)
    }

//Si el evento click coincide con eliminar, se elimina
if (e.target.matches(".delete")) {
  let resp = await fetch("http://localhost:3000/Vuelos")
      jason = await resp.json()
     
  swalWithBootstrapButtons.fire({
    title: `¿Estás seguro de eliminar a ${e.target.dataset.apellido}?`,
    text: "No podrás revertirlo!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, elimínalo!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then(async(result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Borrado!',
        `Has eliminado a ${e.target.dataset.apellido}.`,
        'success'
      )

      let enVuelo = []
      jason.forEach(async (vuelo) => {
        if(vuelo.Funcionarios) {
          if(vuelo.Funcionarios.includes(e.target.dataset.codigo)) {
            enVuelo.push(true)
          } else {
            enVuelo.push(false)
          }
         }
      })


      if(enVuelo.includes(true)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El Funcionario que intentas borrar está asignado a un vuelo!',
          footer: '<a href="../vuelos/vuelos.html">Ver los Vuelos</a>'
        })
      } else {
        try {
          let options = {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=utf-8" }
          }
          
          res = await fetch(`http://localhost:3000/Funcionarios/${e.target.dataset.id}`, options)
          json = await res.json()
      
          if (!res.ok) throw { status: res.status, statusText: res.statusText }
          location.reload()
          } catch (err) {
              let message = err || "Ocurrió un error al borrar"
              alert(`Error ${err.status}: ${message}`)
          }
      }
     

     
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        `${e.target.dataset.apellido} sigue estando.`,
        'error'
      )
    }
  })

  }

})


const filtrar = async () => {

  if($filtro.value != "NOFILTRAR") {

  let cargo = $filtro.value
  try {
    let res = await fetch("http://localhost:3000/Funcionarios")
      json = await res.json()

      let respuesta = await fetch("http://localhost:3000/Dia")
      jason = await respuesta.json()

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

    let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
    let disponible 

    json.sort((a,b) => {
      if (a.HorarioEntrada > b.HorarioEntrada) {
        return 1;
      }
      if (a.HorarioEntrada < b.HorarioEntrada) {
        return -1;
      }
      
      return 0;
    })  

    if(json.slice(parseInt(window.localStorage.getItem('uno')),parseInt(window.localStorage.getItem('dos'))).length < 10) {
      noMasAdelante = true
   } else {
     noMasAdelante = false
   }

   
      
      json.filter((encargado) => encargado.Cargo == cargo).forEach(el => {
      let horarioEntrada = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4))
      let horarioSalida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))

      if (horarioEntrada > horarioSalida) {
        horarioSalida.setDate(horarioSalida.getDate() +1)
      }

      let disponibilidad = "DESC"
      el.DiaSemana.forEach((dia) => {
        if(diaDeHoy == dia) {
          disponibilidad = "SI"
        } 
      })
    
    if(el.Disponibilidad == "BPS") {
      disponibilidad = "BPS"
    }
    disponible = disponibilidad
    el.Disponibilidad = disponible

      let diaSemana = []
      if(el.DiaSemana) {
        el.DiaSemana.forEach((dia) => {
          if(dia == 1) {
            dia = "Lu"
          } 
          if(dia == 2) {
            dia = "Ma"
          } 
          if(dia == 3) {
            dia = "Mi"
          } 
          if(dia == 4) {
            dia = "Ju"
          } 
          if(dia == 5) {
            dia = "Vi"
          } 
          if(dia == 6) {
            dia = "Sa"
          } 
          if(dia == 0) {
            dia = "Do"
          } 
          diaSemana.push(dia)
        })
      } else {
        diaSemana = el.DiaSemana
      }
      
      $template.querySelector(".codigo").textContent = el.Codigo
      $template.querySelector(".apellido").textContent = el.Apellido
      $template.querySelector(".telefono").textContent = el.Telefono
      $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      $template.querySelector(".cargo").textContent = el.Cargo
      $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
      $template.querySelector(".diaSemana").textContent = diaSemana
      $template.querySelector(".edit").dataset.id = el.id
      $template.querySelector(".edit").dataset.codigo = el.Codigo
      $template.querySelector(".edit").dataset.apellido = el.Apellido
      $template.querySelector(".edit").dataset.telefono = el.Telefono
      $template.querySelector(".edit").dataset.horarioEntrada = el.HorarioEntrada
      $template.querySelector(".edit").dataset.horarioSalida = el.HorarioSalida
      $template.querySelector(".edit").dataset.cargo = el.Cargo
      $template.querySelector(".edit").dataset.disponibilidad = el.Disponibilidad
      $template.querySelector(".edit").dataset.diaSemana = el.DiaSemana
      $template.querySelector(".delete").dataset.apellido = el.Apellido
      $template.querySelector(".delete").dataset.codigo = el.Codigo
      $template.querySelector(".delete").dataset.id = el.id

      let $clone = d.importNode($template, true)
      $fragment.appendChild($clone)
    
    })
    $table.querySelector("tbody").remove()
    $table.appendChild(d.createElement("tbody"))
    $table.querySelector("tbody").appendChild($fragment)
    if(d.querySelector(".arrow")) {
      d.querySelector(".arrow").remove()
      if(d.querySelector(".arrow")) {
        d.querySelector(".arrow").remove()
      }
    }
  
  } catch (err) {
    let message = err || "Ocurrió un error al mostrar"
    $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
  }


} else {
  location.reload()
}
}
   


const buscarPorCodigo = async () => {
  try {
    let res = await fetch("http://localhost:3000/Funcionarios")
      json = await res.json()

      let respuesta = await fetch("http://localhost:3000/Dia")
      jason = await respuesta.json()

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

    let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
    let disponible 

    json.sort((a,b) => {
      if (a.HorarioEntrada > b.HorarioEntrada) {
        return 1;
      }
      if (a.HorarioEntrada < b.HorarioEntrada) {
        return -1;
      }
      
      return 0;
    })  

    if(json.slice(parseInt(window.localStorage.getItem('uno')),parseInt(window.localStorage.getItem('dos'))).length < 10) {
      noMasAdelante = true
   } else {
     noMasAdelante = false
   }

       
   let input = document.getElementById("myInput");
      
   json.filter((encargado) => encargado.Codigo == input.value).forEach(el => {
      let horarioEntrada = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4))
      let horarioSalida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))

      if (horarioEntrada > horarioSalida) {
        horarioSalida.setDate(horarioSalida.getDate() +1)
      }

      let disponibilidad = "DESC"
      el.DiaSemana.forEach((dia) => {
        if(diaDeHoy == dia) {
          disponibilidad = "SI"
        } 
      })
    
    if(el.Disponibilidad == "BPS") {
      disponibilidad = "BPS"
    }
    disponible = disponibilidad
    el.Disponibilidad = disponible

      let diaSemana = []
      if(el.DiaSemana) {
        el.DiaSemana.forEach((dia) => {
          if(dia == 1) {
            dia = "Lu"
          } 
          if(dia == 2) {
            dia = "Ma"
          } 
          if(dia == 3) {
            dia = "Mi"
          } 
          if(dia == 4) {
            dia = "Ju"
          } 
          if(dia == 5) {
            dia = "Vi"
          } 
          if(dia == 6) {
            dia = "Sa"
          } 
          if(dia == 0) {
            dia = "Do"
          } 
          diaSemana.push(dia)
        })
      } else {
        diaSemana = el.DiaSemana
      }
      
      $template.querySelector(".codigo").textContent = el.Codigo
      $template.querySelector(".apellido").textContent = el.Apellido
      $template.querySelector(".telefono").textContent = el.Telefono
      $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      $template.querySelector(".cargo").textContent = el.Cargo
      $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
      $template.querySelector(".diaSemana").textContent = diaSemana
      $template.querySelector(".edit").dataset.id = el.id
      $template.querySelector(".edit").dataset.codigo = el.Codigo
      $template.querySelector(".edit").dataset.apellido = el.Apellido
      $template.querySelector(".edit").dataset.telefono = el.Telefono
      $template.querySelector(".edit").dataset.horarioEntrada = el.HorarioEntrada
      $template.querySelector(".edit").dataset.horarioSalida = el.HorarioSalida
      $template.querySelector(".edit").dataset.cargo = el.Cargo
      $template.querySelector(".edit").dataset.disponibilidad = el.Disponibilidad
      $template.querySelector(".edit").dataset.diaSemana = el.DiaSemana
      $template.querySelector(".delete").dataset.apellido = el.Apellido
      $template.querySelector(".delete").dataset.codigo = el.Codigo
      $template.querySelector(".delete").dataset.id = el.id

      let $clone = d.importNode($template, true)
      $fragment.appendChild($clone)
    
    })

    $table.querySelector("tbody").remove()
    $table.appendChild(d.createElement("tbody"))
    $table.querySelector("tbody").appendChild($fragment)
  } catch (err) {
    let message = err || "Ocurrió un error al mostrar"
    $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
  }
}
