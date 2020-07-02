var filas=0;
var columnas=0;
var datos=[];

var modoRespuesta="directa";
// crea la tabla donde se colocaran los datos
function crearTabla(){
    $("#tablaDatos tbody").remove();
    filas=$("#cantidadX").val();
    columnas=$("#cantidadY").val();
    let cadena="<tbody>";
    cadena+="<tr><td></td>";
    for(let y=0;y<columnas;y++){ //agrega la primera fila
        cadena+="<td>B"+y+"</td>";
    }
    cadena+="<td>Oferta</td></tr>";
    for(let x=0;x<filas;x++){ //agrega las filas
        cadena+="<tr id='fila"+x+"'> <td>A"+x+"</td>";
        for(let y=0;y<=columnas;y++){ //agrega las columnas
            cadena+="<td> <input type='number' id='columna"+y+"' class='inputN'></td>";
        }
        cadena+="</tr>";
    }
    cadena+="<tr id='fila"+filas+"'><td>Demanda</td>";
    for(let y=0;y<columnas;y++){ //agrega la ultima fila de demanda
        cadena+="<td><input type='number' id='columna"+y+"' class='inputN'></td>";
    }
    cadena+="</tr></tbody>";
    $("#resolverBtn").show();
    $("#tablaDatos").append(cadena);
}

// Obtiene los datos ingresados a la tabla y los coloca en la lista 'datos'
function obtenerDatos(){
    let temporal=[];
    datos=[];
    let a=0;
    for(let x=0;x<filas;x++){
        for(let y=0;y<columnas;y++){
            a=parseInt($('#tablaDatos tbody #fila'+x+' #columna'+y).val()); //obtiene los costos de las casillas tabla
            temporal.push({"costo":a,"valor":0,"disponible":true,"ct":0});//introduce los costos 
        }
        a=parseInt($('#tablaDatos tbody #fila'+x+' #columna'+columnas).val());//obtiene la casilla de oferta de la tabla
        temporal.push({"oferta":a,"disponibles":a}); // introduce los datos de la casilla oferta

        datos.push(temporal);// introduce la fila a la matriz de datos 
        temporal=[];
    }
    for(let y=0;y<columnas;y++){
        a=parseInt($('#tablaDatos tbody #fila'+filas+' #columna'+y).val()); //obtiene la casilla de demanda
        temporal.push({"demanda":a,"actual":a}); //introduce la casilla de demanda
    }
    datos.push(temporal)// introduce la fila a la matriz de datos 
    console.log(datos);
}

$(document).ready(function(){
	$('input:radio[name=opcion]').change(function(){
        modoRespuesta=$('input:radio[name=opcion]:checked').val();
        });
});
