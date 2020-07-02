var suma=0;
//resuelve 
function resolver(){
    $("#tablas div").remove();
    obtenerDatos();
    if(verificarSolucion()==true)
    {
        let con=0;
           while(con<10)
           {
                let ind=hallarMinimo();
                console.log('minimo');
                console.log(ind);
                if(ind=="no hay casillas disponibles") break;
                else if(datos[ind.y][columnas].disponibles>0) //si la oferta disponible es mayor a 0
                {
                    if(datos[filas][ind.x].actual>0) // si la demanda disponible es mayor a 0
                    {
                        while(datos[filas][ind.x].actual>0 && datos[ind.y][columnas].disponibles>0)
                        {
                            datos[ind.y][columnas].disponibles--;
                            datos[filas][ind.x].actual--;
                            datos[ind.y][ind.x].valor++;
                        }
                        if(datos[filas][ind.x].actual==0)// si la demanda disponible es igual a 0  deshabilita toda la columna
                        {
                            for (let k=0;k<columnas;k++){
                                datos[k][ind.x].disponible=false;
                            }
                        }
                        if(datos[ind.y][columnas].disponibles==0) // si la oferta disponible es igual a 0  deshabilita toda la fila
                        {
                            for (let k=0;k<filas;k++){
                                datos[ind.y][k].disponible=false;
                            }
                        }
                    }
                    else if(datos[filas][ind.x].actual==0)// si la demanda disponible es igual a 0 deshabilita toda la columna
                    {   
                        for (let k=0;k<columnas;k++){
                            datos[k][ind.x].disponible=false;
                        }
                    }
                }
                else if(datos[ind.y][columnas].disponibles==0)// si la oferta disponible es igual a 0 deshabilita toda la fila
                {
                    for (let k=0;k<filas;k++){
                        datos[ind.y][k].disponible=false;
                    }
                }
                if(modoRespuesta=="pasos")
                {
                    imprimirTabla(datos,con);
                }
                con++;  
           }
           alert("Solución hallada");
           console.log(datos);
           if(modoRespuesta=="directa")
           {
                imprimirTabla(datos,"Respuesta directa");
           }
           imprimirRespusta(datos);

    }
    else alert('solucion no hallada');
    
}

//verifica si la suma de la demanda y la oferta son iguales
function verificarSolucion(){ 
    let demanda=0;
    let oferta=0;
    for(let x=0;x<filas;x++)
    {
        oferta+=parseInt(datos[x][columnas].oferta);
    }
    for(let x=0;x<columnas;x++)
    {
        demanda+=parseInt(datos[filas][x].demanda);
    }
    console.log('oferta/demanda: '+oferta+'/'+demanda);
    if(demanda==oferta){suma=oferta;return true;}
    else return false;
}

// devuelve el indice x,y del valor minimo 
function hallarMinimo(){
    let min;
    for(let y=0;y<filas;y++)
    {
        for(let x=0;x<columnas;x++)
            {   if(min==undefined)// añade el valor de un cuadro disponible con el cual se comparara para buscar el menor
                {
                    if(datos[y][x].disponible==true){
                        min={"costo":datos[y][x].costo,"oferta":datos[y][columnas].oferta,"x":x,"y":y} //toma el valor de la casilla y la oferta de la fila
                    }
                } 
            }
    }
    
    for(let y=0;y<filas;y++)
    {
        for(let x=0;x<columnas;x++)
            {   
                if(min!=undefined) // verifica si ya tiene un valor con el cual comparar
                {  
                    if(datos[y][x].disponible==true)// verifica si la casilla esta disponible y no es la misma a la de comparacion
                        {   
                            if(min.costo==datos[y][x].costo)//si el valor es igual
                            {   
                                if(min.oferta<datos[y][columnas].oferta)//selecciona el de mayor oferta
                                { 
                                    min.oferta=datos[y][columnas].oferta;
                                    min.costo=datos[y][x].costo;
                                    min.x=x;
                                    min.y=y;               
                                }
                            }
                            else if(min.costo>datos[y][x].costo)
                            {   
                                min.oferta=datos[y][columnas].oferta;
                                min.costo=datos[y][x].costo;
                                min.x=x;
                                min.y=y;
                            }
                        }
                }
                else if(min==undefined){return "no hay casillas disponibles"}
            }
    }

    if(min!=undefined){return min}  
}

function imprimirTabla(arreglo,titulo){

    let cadena="<hr/><div class='row'><h6> paso:"+titulo+"</h6> <div class='col l8 offset-l2'> \
      <table class='centered highlight stripped'><thead><th></th> ";
    for(let x=0;x<columnas;x++){ // agrega los headers de cada tabla
        cadena+="<th>B"+x+"</th>";
    }
    cadena+="<th>Oferta</th></thead><tbody>";
    for(let y=0;y<filas;y++){ //agrega las variables 
        cadena+="<tr><td>A"+y+"</td>";
        for(let x=0;x<columnas;x++){
            if(arreglo[y][x].disponible==false && arreglo[y][x].valor==0)
            {
                cadena+="<td> <label for=''>"+arreglo[y][x].costo+"</label></br>X</td>";
            }
            else
            {
                cadena+="<td> <label for=''>"+arreglo[y][x].costo+"</label></br>"+arreglo[y][x].valor+"</td>";
            }
        }
        cadena+="<td>"+arreglo[y][columnas].oferta+"</td></tr>";
    }
    cadena+="<tr><td>Demanda</td>";
    for(let x=0;x<columnas;x++){ // agrega los headers de cada tabla
        cadena+="<td>"+arreglo[filas][x].demanda+"</td>";
    }
    cadena=cadena+"<td>"+suma+"/"+suma+"</td></tr></body></table></div></div>";
    $('#tablas ').append(cadena);
  
}

function imprimirRespusta(arreglo){
    let cadena="";
    let respuesta=0;
    for(let y=0;y<filas;y++){
        for(let x=0;x<filas;x++){
            if(datos[y][x].valor>0)
            {
                respuesta+=datos[y][x].costo*datos[y][x].valor;
                cadena+="<h6 style='display:inline;'>"+datos[y][x].valor+"("+datos[y][x].costo+")+</h6>";
            }   
        }
    }
   cadena.slice(0,-6)
   cadena+="</h6><h6 style='display:inline;'>="+respuesta+"</h6>";
   $("#Respuesta").append(cadena);
}