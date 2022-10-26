//Selección de los elementos del html
const d = document
$table = d.querySelector(".crud-table")
$form = d.querySelector(".crud-form")
$template = d.getElementById("crud-template").content
$fragment = d.createDocumentFragment()
$title = d.querySelector(".crud-title")
let funcionarios = []
let cargos = []


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
      let res = await fetch("http://localhost:3000/Vuelos")
        json = await res.json()
  
        let respuesta = await fetch("http://localhost:3000/Funcionarios")
        jason = await respuesta.json()

        let response = await fetch("http://localhost:3000/Dia")
        jeison = await response.json()
  
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

      let dia = new Date(jeison.Dia.substr(0,4),jeison.Dia.substr(5,2)-1,jeison.Dia.substr(8,2))
      $title.textContent = "FECHA:" + space + dia.toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' }).toLocaleUpperCase();


      if(json.slice(parseInt(window.localStorage.getItem('unoVuelo')),parseInt(window.localStorage.getItem('dosVuelo'))).length < 4) {
        noMasAdelante = true
     } else {
       noMasAdelante = false
     }


      json.slice(parseInt(window.localStorage.getItem('unoVuelo')),parseInt(window.localStorage.getItem('dosVuelo'))).forEach(el => {
        $template.querySelector(".title").textContent = 'Vuelo: ' + space + el.Nombre + space + el.Arribo + " x " + el.Partida
        $template.querySelector(".enc").textContent = ""
        $template.querySelector(".op").textContent = ""
        $template.querySelector(".camion").textContent = ""
        $template.querySelector(".micro").textContent = ""
        $template.querySelector(".limp").textContent = ""
        $template.querySelector(".cinta").textContent = ""
        $template.querySelector(".checkin").textContent = ""
        if(el.Cargos && el.Funcionarios) {

          el.Funcionarios.forEach((funcionario) => funcionarios.push(funcionario))

          el.Cargos.forEach((element) => {
            let cargo = {
              codigo: element.codigo,
              trabajo: element.trabajo
            }
            cargos.push(cargo)
          })


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
