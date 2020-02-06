/**
 * Función que hace la peticion de los comics y muestra la información, se le puede pasar un parametro para filtrar
 * @param {integer} filtro 
 */
comics = (filtro) => {
  document.getElementById('spin').style.display = "inline"
  var client = new XMLHttpRequest();
  client.open('GET', `https://gateway.marvel.com:443/v1/public/comics?limit=100&apikey=c7824b3fa7024da6df5a16f48d3c59d8`);
  client.onreadystatechange = function () {
    if (client.readyState === 4 && client.status === 200) {
      $('#areacomic').empty()
      document.getElementById('spin').style.display = "none"
      var array = JSON.parse(this.responseText)
      comicArray = array['data']['results']

      comicArray.forEach(element => {
        titulo = element['title']
        titlomin = titulo.toLowerCase()
        if (filtro != null) {
          filtro = filtro.toLowerCase()
        }
        if (titlomin.includes(filtro) || filtro == null) {
          var divcontent = document.createElement('div')
          var div = document.getElementById('areacomic')
          div.appendChild(divcontent)
          var h2 = document.createElement('h2')
          h2.innerHTML = element['title']
          divcontent.appendChild(h2)
          var img = document.createElement('img')
          img.src = `${element['thumbnail']['path']}.${element['thumbnail']['extension']}`
          img.id = `img${element['id']}`
          img.addEventListener('click', ventanaComic, [this])
          divcontent.appendChild(img)
          var descripcion = document.createElement('p')
          divcontent.appendChild(descripcion)
          var span = document.createElement('span')
          span.setAttribute('id', element['id'])
          descripcion.appendChild(span)
          comprueba(element['id'])
        }
        pagination("#areacomic", "#paginationcomic")
      });
    } else {
      console.log('Error:', client.statusText)
    }
  }
  client.send()
}

/**
 * Función que hace la peticion de los personajes y muestra la información, se le puede pasar un parametro para filtrar
 * @param {integer} filtro 
 */
personajes = (filtro) => {
  document.getElementById('spin2').style.display = "inline"
  var client = new XMLHttpRequest();
  client.open('GET', `https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=c7824b3fa7024da6df5a16f48d3c59d8`);
  client.onreadystatechange = function () {
    if (client.readyState === 4 && client.status === 200) {
      $('#areapersonajes').empty()
      document.getElementById('spin2').style.display = "none"
      var array = JSON.parse(this.responseText)
      personajesArray = array['data']['results']
      personajesArray.forEach(element => {
        titulo = element['name']
        titlomin = titulo.toLowerCase()
        if (filtro != null) {
          filtro = filtro.toLowerCase()
        }
        if (titlomin.includes(filtro) || filtro == null) {
          var divcontent = document.createElement('div')
          var div = document.getElementById('areapersonajes')
          div.appendChild(divcontent)
          var h2 = document.createElement('h2')
          h2.innerHTML = element['name']
          divcontent.appendChild(h2)
          var img = document.createElement('img')
          img.src = `${element['thumbnail']['path']}.${element['thumbnail']['extension']}`
          img.id = `img${element['id']}`
          img.addEventListener('click', ventanaPersonaje, [this])
          divcontent.appendChild(img)
          var descripcion = document.createElement('p')
          divcontent.appendChild(descripcion)
          var span = document.createElement('span')
          span.setAttribute('id', element['id'])
          descripcion.appendChild(span)
        }
        pagination("#areapersonajes", "#paginationpersonajes")
      });
    } else {
      console.log('Error:', client.statusText)
    }
  }
  client.send()
}

/**
 * Función que comprueba la longitud de la descripcion del comic pasado por el parametro id y la acorta y asigna el evento de desacortar
 * @param {integer} id
 */
comprueba = (id) => {
  var cadena
  comicArray.forEach(element => {
    if(element['id'] == id) {
      cadena = element['description']
    }
  });

  var span = document.getElementById(id)
  if (cadena != null) {
    if (cadena.length > 20) {
      cadenacortada = cadena.substring(0,19)
      cadenacortada = `${cadenacortada} <span id='${id}' onclick="desacortar(this)" class="acortar">Ver mas...</span>`
      span.parentElement.innerHTML = cadenacortada
    }
  } else {
    cadena = 'Description no disponible'
    span.parentElement.innerHTML = cadena
  }
}

/**
 * Función que pone la descripcion al comic y asigna el evento de comprueba para acortar al darle a ver menos
 * @param {object} e
 */
desacortar = (e) => {
  id = e['id']
  comicArray.forEach(element => {
    if(element['id'] == id) {
      var span = document.getElementById(id)
      span.parentElement.innerHTML = `${element['description']} <span id='${id}' onclick="comprueba(${id})">Ver menos</span>`
    }
  });
}

/**
 * Función que recoje el valor del filtro y llama a comics pasando el filtro como parametro
 */
filtrarComic = () => {
  $(document).ready(function () {
    filtro = $('#buscarcomic').val()
    comics(filtro)
  });
}

/**
 * Función que recoje el valor del filtro y llama a personajes pasando el filtro como parametro
 */
filtrarPersonaje = () => {
  $(document).ready(function () {
    filtro = $('#buscarpersonaje').val()
    personajes(filtro)
  });
}

/**
 * Función que recoje el id de su elemento asociado y crea la ventana modal de comic
 * @param {object} e
 */
ventanaComic = (e) => {
  $(document).ready(function () {
    if (navigator.userAgent.indexOf("Edge") > -1) {
      console.log('edge')
      id = e['srcElement']['id']
    } else {
      id = e['toElement']['id']
    }
    id = id.substring(3)

    comicArray.forEach(element => {
      if (element['id'] == id) {
        var descripcion = element['description']
        if (descripcion == null) {
          descripcion = 'Description no disponible'
        }
        var caja = $(`<div title="Info"><p>${descripcion}</p></div>`);
        caja.dialog({
          modal: true,
          title: `Info: ${element['title']}`,
          width: 550,
          minWidth: 400,
          maxWidth: 650,
          show: "Fold",
          hide: "Scale"
        });
      }
    });
  });
}

/**
 * Función que recoje el id de su elemento asociado y crea la ventana modal de personaje
 * @param {object} e
 */
ventanaPersonaje = (e) => {
  $(document).ready(function () {
    if (navigator.userAgent.indexOf("Edge") > -1) {
      console.log('edge')
      id = e['srcElement']['id']
    } else {
      id = e['toElement']['id']
    }
    id = id.substring(3)

    personajesArray.forEach(element => {
      if (element['id'] == id) {
        var descripcion = element['description']
        if (descripcion == null || descripcion == "" ) {
          descripcion = 'Description no disponible'
        }
        var caja = $(`<div title="Info"><p>${descripcion}</p></div>`);
        caja.dialog({
          modal: true,
          title: `Info: ${element['name']}`,
          width: 550,
          minWidth: 400,
          maxWidth: 650,
          show: "Fold",
          hide: "Scale"
        });
      }
    });
  });
}

/**
 * Función encargada de hacer la paginación
 * @param {string} area
 * @param {string} areapagination
 */
pagination = (area,areapagination) => {
  jQuery(function ($) {
    var items = $(area).children();
  
    var numItems = items.length;
    var perPage = 10;

    items.slice(perPage).hide();
  
    $(areapagination).pagination({
      items: numItems,
      itemsOnPage: perPage,
      cssStyle: "light-theme",
  
      onPageClick: function (pageNumber) {
        var showFrom = perPage * (pageNumber - 1);
        var showTo = showFrom + perPage;
  
        items.hide()
          .slice(showFrom, showTo).show();
      }
    });
  });
}

var comicArray
comics()
personajes()

var buscarcomic = document.getElementById('buscarcomic')
buscarcomic.addEventListener('keyup',filtrarComic)
var buscarpersonaje = document.getElementById('buscarpersonaje')
buscarpersonaje.addEventListener('keyup',filtrarPersonaje)