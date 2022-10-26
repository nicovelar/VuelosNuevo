const d = document
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idVuelo = urlParams.get('id')
$template = d.getElementById("crud-template").content
$templateVuelo = d.getElementById("crud-template-vuelo").content
$botonEnviar = d.getElementById("botonEnviar").content
$table = d.querySelector(".crud-table-encargados")
$tableVuelo = d.querySelector(".crud-table-encargados-vuelo")
$enviar = d.querySelector(".enviar")
$fragment = d.createDocumentFragment()
$filtro = d.getElementById("filtro")
$title = d.querySelector(".title")
let paraVolar = []

let spacex = '\xa0\xa0 '


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

const getAll = async () => {

  let space = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '

  $botonEnviar.querySelector(".enviar").dataset.id = idVuelo

  let $clone = d.importNode($botonEnviar, true)
  $fragment.appendChild($clone)
  $enviar.appendChild($fragment)

    try {
      let res = await fetch("http://localhost:3000/Funcionarios")
        json = await res.json()

        let respuesta = await fetch("http://localhost:3000/Dia")
        jason = await respuesta.json()

        let response = await fetch("http://localhost:3000/Vuelos/" + idVuelo)
        jeison = await response.json()

        let responsive = await fetch("http://localhost:3000/Vuelos/")
        jeisons = await responsive.json()

      if (!res.ok) throw { status: res.status, statusText: res.statusText }

      let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
      let disponible 
  
      $title.textContent = "Vuelo: " + jeison.Nombre + space + "Arribo: " + jeison.Arribo + space + "Partida: " + jeison.Partida
      paraVolar = jeison.Funcionarios
      let asignados
      if (paraVolar != null) {  
        asignados = json.filter((el) => {
          if(paraVolar.includes(el.Codigo)) {
            return el
          }  
        })
      }

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
        let horarioNocturno
        let horarioArribo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Arribo.substr(0,2),jeison.Arribo.substr(3,4))
        let horarioPartida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Partida.substr(0,2),jeison.Partida.substr(3,4))

        if (horarioArribo > horarioPartida) {
            horarioPartida.setDate(horarioPartida.getDate() +1)
            if (horarioEntrada > horarioSalida) {
                horarioSalida.setDate(horarioSalida.getDate() +1)
              }
        } else  if (horarioEntrada > horarioSalida) {
            let lasDoce = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),00,00)
            let primeraHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))
       

            let segundaHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4)).getTime() 
            let las1159 = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),23,59).getTime()
     
            if (horarioArribo > lasDoce && horarioPartida < primeraHora) {
                horarioNocturno = true  
            }

            if (horarioArribo > segundaHora && horarioPartida < las1159) {
                horarioNocturno = true
            }
   
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
 
        $template.querySelector(".codigo").textContent = el.Codigo
        $template.querySelector(".cargo").textContent = el.Cargo
        $template.querySelector(".telefono").textContent = el.Telefono
        $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
        $template.querySelector(".agregar").dataset.id = el.id
        $template.querySelector(".agregar").dataset.codigo = el.Codigo
        $template.querySelector(".agregar").dataset.apellido = el.Apellido
        $template.querySelector(".agregar").dataset.horarioEntrada = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.horarioSalida = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.cargo = el.Cargo
        $template.querySelector(".agregar").dataset.disponibilidad = el.Disponibilidad
        if(jeison.Cargos) {
          $template.querySelector(".agregar").dataset.trabajo =  jeison.Cargos.filter((trabajos) => trabajos.codigo == el.Codigo).map((element) => element.trabajo)
        } else {
          $template.querySelector(".agregar").dataset.trabajo = "ENC"
        }
       


        if (el.Disponibilidad == "BPS") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(238, 94, 94)"
        }
        if (el.Disponibilidad == "SI") {
            if (horarioArribo > horarioEntrada && horarioPartida < horarioSalida  || horarioNocturno) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(89, 165, 89)"
            } else {
              $template.querySelector(".codigo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".cargo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".telefono").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".agregar").dataset.backgroundColor = "rgb(226, 226, 98)"

            }
        } if(el.Disponibilidad == "DESC") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(132, 132, 250)"
        }


       jeisons.filter((vuelos) => vuelos.id != idVuelo).forEach((vuelo) => {
          let horarioArriboOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Arribo.substr(0,2),vuelo.Arribo.substr(3,4))
          let horarioPartidaOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Partida.substr(0,2),vuelo.Partida.substr(3,4))

          if (horarioArriboOtroVuelo > horarioPartidaOtroVuelo) {
            horarioPartidaOtroVuelo.setDate(horarioPartidaOtroVuelo.getDate() +1)
           } 

        if (horarioArriboOtroVuelo >= horarioArribo && horarioArriboOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"

              }
            })
          }
          
        } else if (horarioPartidaOtroVuelo >= horarioArribo && horarioPartidaOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioArribo >= horarioArriboOtroVuelo && horarioArribo <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioPartida >= horarioArriboOtroVuelo && horarioPartida <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        }

      })
       

        let $clone = d.importNode($template, true)
        $fragment.appendChild($clone)
     
      })
  

      $table.querySelector("tbody").appendChild($fragment)

      let vuelos = []

      jeisons.forEach((vuelo) => {
       
        if(vuelo.Funcionarios) {      
          vuelo.Funcionarios.forEach((funcionarioVuelo) => {
            let enVuelo = []
            let funcionarioCodigo 
              json.forEach((funcionariox) => {
                if(funcionariox.Codigo == funcionarioVuelo) {
                  funcionarioCodigo  = funcionariox.Codigo
                  enVuelo.push(vuelo.Nombre)
                }
              })
            
              vuelos.push({vuelo:enVuelo,funcionario:funcionarioCodigo})
          })
          
        }
      })

    

      $table.querySelectorAll(".codigo").forEach((tr) => {
        vuelos.forEach((element) => {
          if (tr.textContent == element.funcionario) {
            tr.parentNode.querySelector(".vuelos").textContent += element.vuelo + spacex
           }
        })
       
      })

    
      let asignadosOrdenados = []
      if(asignados) {
        for (var i = 0; i < paraVolar.length; i++) {
          asignados.forEach((asignado) => {
            if (asignado.Codigo == paraVolar[i]) {
              asignadosOrdenados.push(asignado)
            }
          })
          }
      }

     

      if (paraVolar != null) {  
 
     
        asignadosOrdenados.forEach((el) => {

          let horarioEntrada = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4))
          let horarioSalida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))
          let horarioNocturno
          let horarioArribo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Arribo.substr(0,2),jeison.Arribo.substr(3,4))
          let horarioPartida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Partida.substr(0,2),jeison.Partida.substr(3,4))
  
          if (horarioArribo > horarioPartida) {
              horarioPartida.setDate(horarioPartida.getDate() +1)
              if (horarioEntrada > horarioSalida) {
                  horarioSalida.setDate(horarioSalida.getDate() +1)
                }
          } else  if (horarioEntrada > horarioSalida) {
              let lasDoce = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),00,00)
              let primeraHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))
         
  
              let segundaHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4)).getTime() 
              let las1159 = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),23,59).getTime()
       
              if (horarioArribo > lasDoce && horarioPartida < primeraHora) {
                  horarioNocturno = true  
              }
  
              if (horarioArribo > segundaHora && horarioPartida < las1159) {
                  horarioNocturno = true
              }
     
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

          $templateVuelo.querySelector(".codigo").textContent = el.Codigo
          $templateVuelo.querySelector(".cargo").textContent = el.Cargo
          $templateVuelo.querySelector(".horarioEntrada").textContent = el.HorarioEntrada
          $templateVuelo.querySelector(".horarioSalida").textContent = el.HorarioSalida
          $templateVuelo.querySelector(".disponibilidad").textContent = el.Disponibilidad
        
    
          if(jeison.Cargos) {
            jeison.Cargos.forEach((cargo) => {
              // console.log(cargo.backgroundColor)
              // $templateVuelo.querySelector(".codigo").style.backgroundColor = cargo.backgroundColor
              // $templateVuelo.querySelector(".cargo").style.backgroundColor = cargo.backgroundColor
              // $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = cargo.backgroundColor
              // $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = cargo.backgroundColor
              // $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = cargo.backgroundColor
            })

            if (el.Disponibilidad == "BPS") {
              $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(238, 94, 94)" 
              $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(238, 94, 94)"
              $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(238, 94, 94)"
              $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(238, 94, 94)"
              $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(238, 94, 94)"
            }
            if (el.Disponibilidad == "SI") {
                if (horarioArribo > horarioEntrada && horarioPartida < horarioSalida  || horarioNocturno) {
                    $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(89, 165, 89)"
                    $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(89, 165, 89)"
                    $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(89, 165, 89)"
                    $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(89, 165, 89)"
                    $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(89, 165, 89)"

                } else {
                  $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(226, 226, 98)"
                  $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(226, 226, 98)"
                  $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(226, 226, 98)"
                  $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(226, 226, 98)"
                  $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(226, 226, 98)"
              
    
                }
            } if(el.Disponibilidad == "DESC") {
              $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(132, 132, 250)"
              $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(132, 132, 250)"            
              $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(132, 132, 250)"
              $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(132, 132, 250)"
              $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(132, 132, 250)"
          
            }
    
    
           jeisons.filter((vuelos) => vuelos.id != idVuelo).forEach((vuelo) => {
              let horarioArriboOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Arribo.substr(0,2),vuelo.Arribo.substr(3,4))
              let horarioPartidaOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Partida.substr(0,2),vuelo.Partida.substr(3,4))
    
              if (horarioArriboOtroVuelo > horarioPartidaOtroVuelo) {
                horarioPartidaOtroVuelo.setDate(horarioPartidaOtroVuelo.getDate() +1)
               } 
    
            if (horarioArriboOtroVuelo >= horarioArribo && horarioArriboOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
              if(vuelo.Funcionarios) {
                vuelo.Funcionarios.forEach((funcionario) => {
                  if(funcionario == el.Codigo) {
                    $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"               
                    $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
    
                  }
                })
              }
              
            } else if (horarioPartidaOtroVuelo >= horarioArribo && horarioPartidaOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
              if(vuelo.Funcionarios) {
                vuelo.Funcionarios.forEach((funcionario) => {
                  if(funcionario == el.Codigo) {
                    $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"             
                    $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
              
                  }
                })
              }
              
            } else if (horarioArribo >= horarioArriboOtroVuelo && horarioArribo <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
              if(vuelo.Funcionarios) {
                vuelo.Funcionarios.forEach((funcionario) => {
                  if(funcionario == el.Codigo) {
                    $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"    
                    $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
            
                  }
                })
              }
              
            } else if (horarioPartida >= horarioArriboOtroVuelo && horarioPartida <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
              if(vuelo.Funcionarios) {
                vuelo.Funcionarios.forEach((funcionario) => {
                  if(funcionario == el.Codigo) {
                    $templateVuelo.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"            
                    $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                    $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                
                  }
                })
              }
              
            }
    
          })



          }


      
        
          $templateVuelo.querySelector(".eliminar").dataset.id = el.id
          $templateVuelo.querySelector(".eliminar").dataset.codigo = el.Codigo
         
        let $clone = d.importNode($templateVuelo, true)
        $fragment.appendChild($clone)
    
        $tableVuelo.querySelector("tbody").appendChild($fragment)

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "ENC") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "ENC"
             }
            })  
          }

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "OP") {
        $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
           if(tr.textContent == el.Codigo ) {
            tr.parentNode.querySelector(".trabajos").value = "OP"
           }
          })  
        }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "MICRO") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "MICRO"
             }
            })  
          }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CAMION") {
            $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
               if(tr.textContent == el.Codigo ) {
                tr.parentNode.querySelector(".trabajos").value = "CAMION"
               }
              })  
            }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "LIMP") {
              $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                 if(tr.textContent == el.Codigo ) {
                  tr.parentNode.querySelector(".trabajos").value = "LIMP"
                 }
                })  
              }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CINTA") {
                $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                   if(tr.textContent == el.Codigo ) {
                    tr.parentNode.querySelector(".trabajos").value = "CINTA"
                   }
                  })  
                }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CHECKIN") {
                  $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                     if(tr.textContent == el.Codigo ) {
                      tr.parentNode.querySelector(".trabajos").value = "CHECKIN"
                     }
                    })  
                  }
    
        })

      }
  
    } catch (err) {
      let message = err || "Ocurrió un error al mostrar"
      $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }

  }
d.addEventListener("DOMContentLoaded", getAll)


d.addEventListener("click", async e => {

  //Si el evento click coincide con editar, se edita
  if (e.target.matches(".agregar")) {

    if(paraVolar == null || !paraVolar.includes(e.target.dataset.codigo) ) {
      $templateVuelo.querySelector(".codigo").textContent = e.target.dataset.codigo
      $templateVuelo.querySelector(".cargo").textContent = e.target.dataset.cargo
      $templateVuelo.querySelector(".horarioEntrada").textContent = e.target.dataset.horarioEntrada
      $templateVuelo.querySelector(".horarioSalida").textContent = e.target.dataset.horarioSalida
      $templateVuelo.querySelector(".disponibilidad").textContent = e.target.dataset.disponibilidad
      $templateVuelo.querySelector(".eliminar").dataset.id = e.target.dataset.id
      $templateVuelo.querySelector(".eliminar").dataset.codigo = e.target.dataset.codigo
      $templateVuelo.querySelector(".eliminar").dataset.backgroundColor = e.target.dataset.backgroundColor

      $templateVuelo.querySelector(".codigo").style.backgroundColor = e.target.dataset.backgroundColor
      $templateVuelo.querySelector(".cargo").style.backgroundColor = e.target.dataset.backgroundColor
      $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = e.target.dataset.backgroundColor
      $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = e.target.dataset.backgroundColor
      $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = e.target.dataset.backgroundColor

      let $clone = d.importNode($templateVuelo, true)
      $fragment.appendChild($clone)
  
      $tableVuelo.querySelector("tbody").appendChild($fragment)
  
      $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
        if(paraVolar == null) {
          paraVolar = []
        }
        if(!paraVolar.includes(tr.textContent))
        paraVolar.push(e.target.dataset.codigo)
      })
    } else {
      Swal.fire("El usuario ya está incluido")
    }

  }
  
  //Si el evento click coincide con eliminar, se elimina
  if (e.target.matches(".eliminar")) {
   paraVolar = paraVolar.filter((elements) => elements !== e.target.dataset.codigo.toString())
    e.target.parentNode.parentNode.remove()
  }

  

   //Si el evento click coincide con eliminar, se elimina
   if (e.target.matches(".enviar")) {

    let cargos = []
    let paraVolar = []
   $tableVuelo.querySelectorAll(".trabajos").forEach((select) => {
    let cargo = {
      codigo:select.parentNode.parentNode.querySelector(".codigo").textContent,
      trabajo:select.value,
      backgroundColor:select.parentNode.parentNode.querySelector(".eliminar").dataset.backgroundColor
    }
    cargos.push(cargo)
    paraVolar.push(select.parentNode.parentNode.querySelector(".codigo").textContent)
   })

 
   if(e.target.dataset.id) {
    try {
      let options = {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
         Funcionarios: paraVolar,
         Cargos:cargos
      })}
      
      res = await fetch(`http://localhost:3000/Vuelos/${e.target.dataset.id}`, options)
      
      json = await res.json()
     

      if (!res.ok) throw { status: res.status, statusText: res.statusText }

      } catch (err) {
        let message = err || "Ocurrió un error al publicar"
        $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
      }
   }

  

   }
})




const filtrar = async () => {

  let cargo = $filtro.value
  if(cargo !== "NOFILTRAR") {

  let space = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '

  $botonEnviar.querySelector(".enviar").dataset.id = idVuelo

  let $clone = d.importNode($botonEnviar, true)
  $fragment.appendChild($clone)
  $enviar.appendChild($fragment)
  d.querySelector(".enviar").querySelectorAll(".button4")[1].remove()

    try {
      let res = await fetch("http://localhost:3000/Funcionarios")
        json = await res.json()

        let respuesta = await fetch("http://localhost:3000/Dia")
        jason = await respuesta.json()

        let response = await fetch("http://localhost:3000/Vuelos/" + idVuelo)
        jeison = await response.json()

        let responsive = await fetch("http://localhost:3000/Vuelos/")
        jeisons = await responsive.json()

      if (!res.ok) throw { status: res.status, statusText: res.statusText }

      let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
      let disponible 
  
  
      $title.textContent = "Vuelo: " + jeison.Nombre + space + "Arribo: " + jeison.Arribo + space + "Partida: " + jeison.Partida
      paraVolar = jeison.Funcionarios
      let asignados
      if (paraVolar != null) {  
        asignados = json.filter((el) => {
          if(paraVolar.includes(el.Codigo)) {
            return el
          }  
        })
      }

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
        let horarioNocturno
        let horarioArribo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Arribo.substr(0,2),jeison.Arribo.substr(3,4))
        let horarioPartida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Partida.substr(0,2),jeison.Partida.substr(3,4))

        if (horarioArribo > horarioPartida) {
            horarioPartida.setDate(horarioPartida.getDate() +1)
            if (horarioEntrada > horarioSalida) {
                horarioSalida.setDate(horarioSalida.getDate() +1)
              }
        } else  if (horarioEntrada > horarioSalida) {
            let lasDoce = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),00,00)
            let primeraHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))
       

            let segundaHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4)).getTime() 
            let las1159 = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),23,59).getTime()
     
            if (horarioArribo > lasDoce && horarioPartida < primeraHora) {
                horarioNocturno = true  
            }

            if (horarioArribo > segundaHora && horarioPartida < las1159) {
                horarioNocturno = true
            }
   
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
 
        $template.querySelector(".codigo").textContent = el.Codigo
        $template.querySelector(".cargo").textContent = el.Cargo
        $template.querySelector(".telefono").textContent = el.Telefono
        $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
        $template.querySelector(".agregar").dataset.id = el.id
        $template.querySelector(".agregar").dataset.codigo = el.Codigo
        $template.querySelector(".agregar").dataset.apellido = el.Apellido
        $template.querySelector(".agregar").dataset.horarioEntrada = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.horarioSalida = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.cargo = el.Cargo
        $template.querySelector(".agregar").dataset.disponibilidad = el.Disponibilidad
        if(jeison.Cargos) {
          $template.querySelector(".agregar").dataset.trabajo =  jeison.Cargos.filter((trabajos) => trabajos.codigo == el.Codigo).map((element) => element.trabajo)
        } else {
          $template.querySelector(".agregar").dataset.trabajo = "ENC"
        }
       


        if (el.Disponibilidad == "BPS") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(238, 94, 94)"
        }
        if (el.Disponibilidad == "SI") {
            if (horarioArribo > horarioEntrada && horarioPartida < horarioSalida  || horarioNocturno) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(89, 165, 89)"
            } else {
              $template.querySelector(".codigo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".cargo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".telefono").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".agregar").dataset.backgroundColor = "rgb(226, 226, 98)"

            }
        } if(el.Disponibilidad == "DESC") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(132, 132, 250)"
        }


       jeisons.filter((vuelos) => vuelos.id != idVuelo).forEach((vuelo) => {
          let horarioArriboOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Arribo.substr(0,2),vuelo.Arribo.substr(3,4))
          let horarioPartidaOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Partida.substr(0,2),vuelo.Partida.substr(3,4))

          if (horarioArriboOtroVuelo > horarioPartidaOtroVuelo) {
            horarioPartidaOtroVuelo.setDate(horarioPartidaOtroVuelo.getDate() +1)
           } 

        if (horarioArriboOtroVuelo >= horarioArribo && horarioArriboOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"

              }
            })
          }
          
        } else if (horarioPartidaOtroVuelo >= horarioArribo && horarioPartidaOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioArribo >= horarioArriboOtroVuelo && horarioArribo <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioPartida >= horarioArriboOtroVuelo && horarioPartida <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        }

      })
       
      $tableVuelo.querySelector("tbody").remove()
      $tableVuelo.appendChild(d.createElement("tbody"))
      $table.querySelector("tbody").remove()
      $table.appendChild(d.createElement("tbody"))
        let $clone = d.importNode($template, true)
        $fragment.appendChild($clone)
     
      })
  

      $table.querySelector("tbody").appendChild($fragment)

      let vuelos = []

      jeisons.forEach((vuelo) => {
       
        if(vuelo.Funcionarios) {      
          vuelo.Funcionarios.forEach((funcionarioVuelo) => {
            let enVuelo = []
            let funcionarioCodigo 
              json.forEach((funcionariox) => {
                if(funcionariox.Codigo == funcionarioVuelo) {
                  funcionarioCodigo  = funcionariox.Codigo
                  enVuelo.push(vuelo.Nombre)
                }
              })
            
              vuelos.push({vuelo:enVuelo,funcionario:funcionarioCodigo})
          })
          
        }
      })

    

      $table.querySelectorAll(".codigo").forEach((tr) => {
        vuelos.forEach((element) => {
          if (tr.textContent == element.funcionario) {
            tr.parentNode.querySelector(".vuelos").textContent += element.vuelo + spacex
           }
        })
       
      })

    

      if (paraVolar != null) {  

       
       
     
        asignados.forEach((el) => {
          $templateVuelo.querySelector(".codigo").textContent = el.Codigo
          $templateVuelo.querySelector(".cargo").textContent = el.Cargo
          $templateVuelo.querySelector(".horarioEntrada").textContent = el.HorarioEntrada
          $templateVuelo.querySelector(".horarioSalida").textContent = el.HorarioSalida
          $templateVuelo.querySelector(".disponibilidad").textContent = el.Disponibilidad
        
    
          if(jeison.Cargos) {
            jeison.Cargos.forEach((cargo) => {
              $templateVuelo.querySelector(".codigo").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".cargo").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = cargo.backgroundColor
            })
          }
         
        
          $templateVuelo.querySelector(".eliminar").dataset.id = el.id
          $templateVuelo.querySelector(".eliminar").dataset.codigo = el.Codigo
         
        let $clone = d.importNode($templateVuelo, true)
        $fragment.appendChild($clone)
    
        $tableVuelo.querySelector("tbody").appendChild($fragment)

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "ENC") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "ENC"
             }
            })  
          }

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "OP") {
        $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
           if(tr.textContent == el.Codigo ) {
            tr.parentNode.querySelector(".trabajos").value = "OP"
           }
          })  
        }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "MICRO") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "MICRO"
             }
            })  
          }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CAMION") {
            $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
               if(tr.textContent == el.Codigo ) {
                tr.parentNode.querySelector(".trabajos").value = "CAMION"
               }
              })  
            }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "LIMP") {
              $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                 if(tr.textContent == el.Codigo ) {
                  tr.parentNode.querySelector(".trabajos").value = "LIMP"
                 }
                })  
              }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CINTA") {
                $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                   if(tr.textContent == el.Codigo ) {
                    tr.parentNode.querySelector(".trabajos").value = "CINTA"
                   }
                  })  
                }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CHECKIN") {
                  $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                     if(tr.textContent == el.Codigo ) {
                      tr.parentNode.querySelector(".trabajos").value = "CHECKIN"
                     }
                    })  
                  }
     



        })

        if(d.querySelector(".arrow")) {
          d.querySelector(".arrow").remove()
          if(d.querySelector(".arrow")) {
            d.querySelector(".arrow").remove()
          }
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

  let space = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '

  $botonEnviar.querySelector(".enviar").dataset.id = idVuelo

  let $clone = d.importNode($botonEnviar, true)
  $fragment.appendChild($clone)
  $enviar.appendChild($fragment)
  d.querySelector(".enviar").querySelectorAll(".button4")[1].remove()

    try {
      let res = await fetch("http://localhost:3000/Funcionarios")
        json = await res.json()

        let respuesta = await fetch("http://localhost:3000/Dia")
        jason = await respuesta.json()

        let response = await fetch("http://localhost:3000/Vuelos/" + idVuelo)
        jeison = await response.json()

        let responsive = await fetch("http://localhost:3000/Vuelos/")
        jeisons = await responsive.json()

      if (!res.ok) throw { status: res.status, statusText: res.statusText }

      let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
      let disponible 
  
  
      $title.textContent = "Vuelo: " + jeison.Nombre + space + "Arribo: " + jeison.Arribo + space + "Partida: " + jeison.Partida
      paraVolar = jeison.Funcionarios
      let asignados
      if (paraVolar != null) {  
        asignados = json.filter((el) => {
          if(paraVolar.includes(el.Codigo)) {
            return el
          }  
        })
      }

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
        let horarioNocturno
        let horarioArribo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Arribo.substr(0,2),jeison.Arribo.substr(3,4))
        let horarioPartida = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),jeison.Partida.substr(0,2),jeison.Partida.substr(3,4))

        if (horarioArribo > horarioPartida) {
            horarioPartida.setDate(horarioPartida.getDate() +1)
            if (horarioEntrada > horarioSalida) {
                horarioSalida.setDate(horarioSalida.getDate() +1)
              }
        } else  if (horarioEntrada > horarioSalida) {
            let lasDoce = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),00,00)
            let primeraHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioSalida.substr(0,2),el.HorarioSalida.substr(3,4))
       

            let segundaHora = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),el.HorarioEntrada.substr(0,2),el.HorarioEntrada.substr(3,4)).getTime() 
            let las1159 = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),23,59).getTime()
     
            if (horarioArribo > lasDoce && horarioPartida < primeraHora) {
                horarioNocturno = true  
            }

            if (horarioArribo > segundaHora && horarioPartida < las1159) {
                horarioNocturno = true
            }
   
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
 
        $template.querySelector(".codigo").textContent = el.Codigo
        $template.querySelector(".cargo").textContent = el.Cargo
        $template.querySelector(".telefono").textContent = el.Telefono
        $template.querySelector(".horarioEntrada").textContent = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".horarioSalida").textContent = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".disponibilidad").textContent = el.Disponibilidad
        $template.querySelector(".agregar").dataset.id = el.id
        $template.querySelector(".agregar").dataset.codigo = el.Codigo
        $template.querySelector(".agregar").dataset.apellido = el.Apellido
        $template.querySelector(".agregar").dataset.horarioEntrada = horarioEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.horarioSalida = horarioSalida.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        $template.querySelector(".agregar").dataset.cargo = el.Cargo
        $template.querySelector(".agregar").dataset.disponibilidad = el.Disponibilidad
        if(jeison.Cargos) {
          $template.querySelector(".agregar").dataset.trabajo =  jeison.Cargos.filter((trabajos) => trabajos.codigo == el.Codigo).map((element) => element.trabajo)
        } else {
          $template.querySelector(".agregar").dataset.trabajo = "ENC"
        }
       


        if (el.Disponibilidad == "BPS") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(238, 94, 94)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(238, 94, 94)"
        }
        if (el.Disponibilidad == "SI") {
            if (horarioArribo > horarioEntrada && horarioPartida < horarioSalida  || horarioNocturno) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(89, 165, 89)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(89, 165, 89)"
            } else {
              $template.querySelector(".codigo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".cargo").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".telefono").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(226, 226, 98)"
              $template.querySelector(".agregar").dataset.backgroundColor = "rgb(226, 226, 98)"

            }
        } if(el.Disponibilidad == "DESC") {
          $template.querySelector(".codigo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".cargo").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".telefono").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(132, 132, 250)"
          $template.querySelector(".agregar").dataset.backgroundColor = "rgb(132, 132, 250)"
        }


       jeisons.filter((vuelos) => vuelos.id != idVuelo).forEach((vuelo) => {
          let horarioArriboOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Arribo.substr(0,2),vuelo.Arribo.substr(3,4))
          let horarioPartidaOtroVuelo = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2),vuelo.Partida.substr(0,2),vuelo.Partida.substr(3,4))

          if (horarioArriboOtroVuelo > horarioPartidaOtroVuelo) {
            horarioPartidaOtroVuelo.setDate(horarioPartidaOtroVuelo.getDate() +1)
           } 

        if (horarioArriboOtroVuelo >= horarioArribo && horarioArriboOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"

              }
            })
          }
          
        } else if (horarioPartidaOtroVuelo >= horarioArribo && horarioPartidaOtroVuelo <= horarioPartida && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioArribo >= horarioArriboOtroVuelo && horarioArribo <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        } else if (horarioPartida >= horarioArriboOtroVuelo && horarioPartida <= horarioPartidaOtroVuelo && el.Disponibilidad != "BPS") {
          if(vuelo.Funcionarios) {
            vuelo.Funcionarios.forEach((funcionario) => {
              if(funcionario == el.Codigo) {
                $template.querySelector(".codigo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".cargo").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".telefono").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioEntrada").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".horarioSalida").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".disponibilidad").style.backgroundColor = "rgb(178, 120, 233)"
                $template.querySelector(".agregar").dataset.backgroundColor = "rgb(178, 120, 233)"
              }
            })
          }
          
        }

      })
       
      $tableVuelo.querySelector("tbody").remove()
      $tableVuelo.appendChild(d.createElement("tbody"))
      $table.querySelector("tbody").remove()
      $table.appendChild(d.createElement("tbody"))
        let $clone = d.importNode($template, true)
        $fragment.appendChild($clone)
     
      })
  

      $table.querySelector("tbody").appendChild($fragment)

      let vuelos = []

      jeisons.forEach((vuelo) => {
       
        if(vuelo.Funcionarios) {      
          vuelo.Funcionarios.forEach((funcionarioVuelo) => {
            let enVuelo = []
            let funcionarioCodigo 
              json.forEach((funcionariox) => {
                if(funcionariox.Codigo == funcionarioVuelo) {
                  funcionarioCodigo  = funcionariox.Codigo
                  enVuelo.push(vuelo.Nombre)
                }
              })
            
              vuelos.push({vuelo:enVuelo,funcionario:funcionarioCodigo})
          })
          
        }
      })

    

      $table.querySelectorAll(".codigo").forEach((tr) => {
        vuelos.forEach((element) => {
          if (tr.textContent == element.funcionario) {
            if(!tr.parentNode.querySelector(".vuelos").textContent.includes(element.vuelo)) {
              tr.parentNode.querySelector(".vuelos").textContent += element.vuelo + spacex
            }
            
           }
        })
       
      })

    

      if (paraVolar != null) {  
     
        asignados.forEach((el) => {
          $templateVuelo.querySelector(".codigo").textContent = el.Codigo
          $templateVuelo.querySelector(".cargo").textContent = el.Cargo
          $templateVuelo.querySelector(".horarioEntrada").textContent = el.HorarioEntrada
          $templateVuelo.querySelector(".horarioSalida").textContent = el.HorarioSalida
          $templateVuelo.querySelector(".disponibilidad").textContent = el.Disponibilidad
        
    
          if(jeison.Cargos) {
            jeison.Cargos.forEach((cargo) => {
              $templateVuelo.querySelector(".codigo").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".cargo").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".horarioEntrada").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".horarioSalida").style.backgroundColor = cargo.backgroundColor
              $templateVuelo.querySelector(".disponibilidad").style.backgroundColor = cargo.backgroundColor
            })
          }
         
        
          $templateVuelo.querySelector(".eliminar").dataset.id = el.id
          $templateVuelo.querySelector(".eliminar").dataset.codigo = el.Codigo
         
        let $clone = d.importNode($templateVuelo, true)
        $fragment.appendChild($clone)
    
        $tableVuelo.querySelector("tbody").appendChild($fragment)

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "ENC") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "ENC"
             }
            })  
          }

        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "OP") {
        $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
           if(tr.textContent == el.Codigo ) {
            tr.parentNode.querySelector(".trabajos").value = "OP"
           }
          })  
        }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "MICRO") {
          $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
             if(tr.textContent == el.Codigo ) {
              tr.parentNode.querySelector(".trabajos").value = "MICRO"
             }
            })  
          }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CAMION") {
            $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
               if(tr.textContent == el.Codigo ) {
                tr.parentNode.querySelector(".trabajos").value = "CAMION"
               }
              })  
            }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "LIMP") {
              $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                 if(tr.textContent == el.Codigo ) {
                  tr.parentNode.querySelector(".trabajos").value = "LIMP"
                 }
                })  
              }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CINTA") {
                $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                   if(tr.textContent == el.Codigo ) {
                    tr.parentNode.querySelector(".trabajos").value = "CINTA"
                   }
                  })  
                }
        if (jeison.Cargos.filter((elements) => elements.codigo == el.Codigo).map((element) => element.trabajo)[0] == "CHECKIN") {
                  $tableVuelo.querySelectorAll(".codigo").forEach((tr) => {
                     if(tr.textContent == el.Codigo ) {
                      tr.parentNode.querySelector(".trabajos").value = "CHECKIN"
                     }
                    })  
                  }
     



        })

        if(d.querySelector(".arrow")) {
          d.querySelector(".arrow").remove()
          if(d.querySelector(".arrow")) {
            d.querySelector(".arrow").remove()
          }
        }

      }
  
    } catch (err) {
      let message = err || "Ocurrió un error al mostrar"
      $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }

  
  }