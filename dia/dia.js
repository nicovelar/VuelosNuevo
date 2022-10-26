//Selección de los elementos del html
const d = document
$tableDia = d.querySelector(".crud-table-dia")
$formDia = d.querySelector(".crud-form-dia")
$templateDia = d.getElementById("crud-template-dia").content
$fragment = d.createDocumentFragment()
$title = d.querySelector(".crud-title")

  const getDia = async () => {


      try {
        let res = await fetch("http://localhost:3000/Dia")
        json = await res.json()

        let resp = await fetch("http://localhost:3000/Funcionarios")
        jsonn = await resp.json()

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

      $templateDia.querySelector(".dia").textContent = json.Dia
      let dia = new Date(json.Dia.substr(0,4),json.Dia.substr(5,2)-1,json.Dia.substr(8,2))
      $templateDia.querySelector(".diaCompleto").textContent = dia.toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' }).toLocaleUpperCase();
     
      let $clone = d.importNode($templateDia, true)
      $fragment.appendChild($clone)


    $tableDia.querySelector("tbody").appendChild($fragment)
  } catch (err) {
    let message = err || "Ocurrió un error al mostrar"
    $tableDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)

  }
  }
d.addEventListener("DOMContentLoaded", getDia)

// //A través del método POST creamos un nuevo funcionario
d.addEventListener("submit", async e => {
  e.preventDefault()
  if (e.target === $formDia) {
     try {
        let options = {
        method: "PUT",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            Dia: e.target.dia.value,
        })}
        
        res = await fetch("http://localhost:3000/Dia", options)
        
        json = await res.json()
  
        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        } catch (err) {
          let message = err || "Ocurrió un error al publicar"
          $formDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }
        setTimeout(function(){
          window.location.reload();
        });
  }
  
  })
