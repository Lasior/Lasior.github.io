const minimoisla = 4
const maximoisla = 7
const facil = 4
const medio = 7
const experto = 8

const islas = ["Tenerife", "Gran canaria", "La palma", "El hierro", "La gomera", "Fuerteventura", "Lanzarote"]
const trajes = [
   { traje: '53-Traje-tipico-Tenerife-hombre-min.png', isla: 'Tenerife' },
   { traje: '54-Traje-tipico-Tenerife-mujer-min.png', isla: 'Tenerife' },
   { traje: '51-Traje-Tipico-Gran-Canaria-hombre-min.png', isla: 'Gran canaria' },
   { traje: '52-Traje-tipico-Gran-Canaria-mujer-min.png', isla: 'Gran canaria' },
   { traje: '47-Traje-tipico-de-La-Palma-hombre-min.png', isla: 'La palma' },
   { traje: '48-Traje-tipico-de-La-Palma-mujer-min.png', isla: 'La palma' },
   { traje: '41-Traje-tipico-de-El-Hierro-hombre-min.png', isla: 'El hierro' },
   { traje: '42-Traje-tipico-de-El-Hierro-mujer-min.png', isla: 'El hierro' },
   { traje: '45-Traje-tipico-de-la-Gomera-hombre-min.png', isla: 'La gomera' },
   { traje: '46-Traje-tipico-de-La-Gomera-mujer-min.png', isla: 'La gomera' },
   { traje: '43-Traje-tipico-de-Fuerteventura-hombre-min.png', isla: 'Fuerteventura' },
   { traje: '44-Traje-tipico-de-Fuerteventura-mujer-min.png', isla: 'Fuerteventura' },
   { traje: '49-Traje-tipico-de-Lanzarote-hombre-min.png', isla: 'Lanzarote' },
   { traje: '50-Traje-tipico-de-Lanzarote-mujer-min.png', isla: 'Lanzarote' }
]

/**
 * Función jquery que da estilo a los botones, al area de juego y añade los eventos a los botones
 */

$(document).ready(() => {
   $(".boton").button();
   $("#areajuego").css("width", "1000px").css("height", "600px").css("background-color", "lightblue")

   $("#facil").on("click", () => {
      $(this).css("color", "blue")
      dificultad(facil)
   })

   $("#medio").on("click", () => {
      $(this).css("color", "blue")
      dificultad(medio)
   })

   $("#experto").on("click", () => {
      $(this).css("color", "blue")
      dificultad(experto)
   })
});

/**
 * Funcion que crea el juego con un numero de islas aleatorio y el numero de trajes a mostrar se pasan por parametro
 * @param {integer} nDificultad 
 */

dificultad = (nDificultad) => {

   nIslas = getRandomInt(minimoisla, maximoisla + 1)

   $("#botones").hide()
   $("#areajuego").empty()

   let islasJuego = []
   let contador = 0

   $('#areajuego').append(`<div id='zonaislas'></div>`)

   /**
    *  Bucle que añade las islas a un array y las muestra al jugador
    */

   while (nIslas != contador) {
      aleatorio = getRandomInt(0, 6 + 1)
      if (!islasJuego.includes(islas[aleatorio])) {
         islasJuego.push(islas[aleatorio])
         $('#zonaislas').append(`<p id="${islas[aleatorio]}" class="caja">${islas[aleatorio]}</p>`)
         $('#zonaislas').css('display', 'flex').css('justify-content', 'center').css('padding-top','200px')
         $('.caja').css('display', 'flex').css('align-items', 'flex-end').css('justify-content', 'center').css("width", "150px").css("height", "200px")
         $('.caja').css("background-color", "lightyellow").css('border', 'solid 1px').css('margin', '10px')
         contador++
      }
   }

   let trajesIslasJuego = trajes.filter(traje =>
      islasJuego.includes(traje.isla)
   )

   let mostrar = [];
   contador = 0;

   /**
    *  Bucle que añade los trajes que luego se mostraran al jugador
    */

   while (nDificultad != contador) {
      let traje = trajesIslasJuego[Math.floor(Math.random() * trajesIslasJuego.length)].traje;
      if (!mostrar.includes(traje)) {
         mostrar.push(traje)
         contador++;
      }
   }

   $('#areajuego').prepend(`<div id='zonatrajes'></div>`)
   $('#zonatrajes').css('display', 'flex').css('justify-content', 'center').css('padding-top','10px')

   for (let i = 0; i < mostrar.length; i++) {
      let nuevoTraje = $(`<img src="img/${mostrar[i]}">`)
      nuevoTraje.css("height", "150").css("width", "100").css("display", "inline-block")

      let islaTraje = trajes.find(function (traje) {
         return traje.traje == mostrar[i];
      });

      nuevoTraje.attr("id", islaTraje.isla)
      $("#zonatrajes").append(nuevoTraje)
   }

   /**
    *  Se pone los eventos de draggable a las imagenes y droppable a las islas
    */

   $("#zonatrajes").find("img").each(function () {
      $(this).draggable({
         cursor: 'move',
         containment: $(this).parent().parent()
      });
   });

   var contadorFinal = 0;
   $("#zonaislas").find("p").droppable({
      drop: function (event, ui) {
         if (ui.draggable.attr("id") == $(this).attr("id")) {
            ui.draggable.css("background-color","green");
            notification('success')
            $("#puntos").html(1 + parseInt($("#puntos").html()))
         }
         else {
            notification('error')
            ui.draggable.css("background-color","red");
         }
         $(ui.draggable).draggable("destroy")
         contadorFinal++
         if(contadorFinal == mostrar.length) {
            ventana()
         }
      }
   });
}

/**
 * Funcion que genera un numero al azar entre los recibidos por parametros
 * @param {integer} min
 * @param {integer} max
 */

getRandomInt = (min, max) => {
   return Math.floor(Math.random() * (max - min)) + min;
}

toastr.options.closeButton = true;
toastr.options.positionClass = "toast-bottom-right";

/**
 * Funcion que muestra la notificacion correspondiente al parametro recibido
 * @param {string} type
 */

notification = (type) => {
   if (type == 'success') {
      toastr.success('<i>Has acertado</i>');
   } else if (type == 'error') {
      toastr.error('Fallaste');
   }
}

/**
 * Funcion que crea la ventana modal al finalizar el juego
 */

ventana = () => {
   var puntos = parseInt($('#puntos').html())
   var caja = $(`<div title="Terminado"><p>Has conseguido ${puntos} puntos.</p><p>¿Quieres jugar de nuevo?</p></div>`);   
   caja.dialog({
      modal: true, 
      title: "Ventana modal", 
      width: 550, 
      minWidth: 400, 
      maxWidth: 650, 
      show: "Fold",  
      hide: "Scale", 
      buttons: {     
         "Si": function () {
            $("#botones").show()
            $("#areajuego").empty()
            $("#puntos").html(0)
            $(this).dialog("close");
         },
         "No": function () {
            $(this).dialog("close");
         }
      }
   });
}