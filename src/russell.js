var suma = 0;
//resuelve 
function resolver() {
    $("#tablas div").remove();
    obtenerDatos();
    imprimirTabla(datos,'inicio');
    if(verificarSolucion()==true)
    {
        let con=0;
           while(con<10)
           {    
               console.log(datos);
                let ind=hallarCtMax();
                console.log('vuelta:'+con);
                if(ind=="no hay casillas disponibles") break;
                else if(datos[ind.y][columnas].disponibles>0) //si la oferta disponible es mayor a 0
                {

                    if(datos[filas][ind.x].actual>0) // si la demanda disponible es mayor a 0
                    {
                        while((datos[filas][ind.x].actual>0) && (datos[ind.y][columnas].disponibles>0))
                        {   
                            console.log('modificando tabla');
                            console.log(ind);
                            datos[ind.y][columnas].disponibles--;
                            datos[filas][ind.x].actual--;
                            datos[ind.y][ind.x].valor++;
                        }
                        if(datos[filas][ind.x].actual==0)// si la demanda disponible es igual a 0  deshabilita toda la columna
                        {
                            for (let k=0;k<filas;k++){
                                datos[k][ind.x].disponible=false;
                            }
                        }
                        if(datos[ind.y][columnas].disponibles==0) // si la oferta disponible es igual a 0  deshabilita toda la fila
                        {
                            for (let k=0;k<columnas;k++){
                                datos[ind.y][k].disponible=false;
                            }
                        }
                    }
                    else if(datos[filas][ind.x].actual==0)// si la demanda disponible es igual a 0 deshabilita toda la columna
                    {   
                        for (let k=0;k<filas;k++){
                            datos[k][ind.x].disponible=false;
                        }
                    }
                }
                else if(datos[ind.y][columnas].disponibles==0)// si la oferta disponible es igual a 0 deshabilita toda la fila
                {
                    for (let k=0;k<columnas;k++){
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
           imprimirRespuesta(datos);

    }
    else alert('solucion no hallada');

}

//verifica si la suma de la demanda y la oferta son iguales
function verificarSolucion() {
    let demanda = 0;
    let oferta = 0;
    for (let x = 0; x < filas; x++) {
        oferta += parseInt(datos[x][columnas].oferta);
    }
    for (let x = 0; x < columnas; x++) {
        demanda += parseInt(datos[filas][x].demanda);
    }
    console.log('oferta/demanda: ' + oferta + '/' + demanda);
    if (demanda == oferta) { suma = oferta; return true; }
    else return false;
}

//halla la casilla que se utilizara 
function hallarCtMax() 
{
    obtenerCt();
    let ctMax=null;
    for(let y=0;y<columnas;y++)
    {
        for(let x=0;x<filas;x++)
        {
            if(datos[y][x].disponible==true)
            {
                ctMax={'ct':datos[y][x].ct,'y':y,'x':x}; // añade primer valor disponible
            }
        }
    }

    if(ctMax!=null)
    {
        for(let y=0;y<columnas;y++)
        {
            for(let x=0;x<filas;x++)
            {
                if((datos[y][x].disponible==true) && (datos[y][x].ct>max.ct))
                {
                    ctMax={'ct':datos[y][x].ct,'y':y,'x':x};// si encuentra uno mayor toma ese valor
                }
            }
        }

        return ctMax;
    }
    else
    {
        return "no hay casillas disponibles";
    }
}

// busca el maximo de un matriz por fila o columna
function IndiceMayor(matriz, indice, modo) {
    console.log('indice:' + indice + ' modo:' + modo);
    if (modo == "fila") 
    {   
        let max;
        for (let c = 0; c < columnas; c++) 
        {
            if ((matriz[indice][c].disponible == true)) 
            {
                max = { 'costo': matriz[indice][c].costo, 'y': indice, 'x': c };
            }
        }
        
        for (let c = 0; c < columnas; c++) 
        {
            if ((max.costo < matriz[indice][c].costo) && (matriz[indice][c].disponible == true)) {
                max = { 'costo': matriz[indice][c].costo, 'y': indice, 'x': c };
            }
        }
        console.log('retorno de la casilla a usar:');
        console.log(max);
        return max;
    }
    else if (modo == "columna") {
        for (let c = 0; c < columnas; c++) 
        {
            if ((matriz[c][indice].disponible == true)) {
                max = { 'costo': matriz[c][indice].costo, 'y': c, 'x': indice };
            }
        }
        for (let c = 0; c < columnas; c++) 
        {
            if ((max.costo < matriz[c][indice].costo) && (matriz[c][indice].disponible == true)) {
                max = { 'costo': matriz[c][indice].costo, 'y': c, 'x': indice };
            }
        }
        console.log('retorno de la casilla a usar:');
        console.log(max);
        return max;
    }

}

function obtenerCt()
{
    for(let y=0;y<filas;y++)
    {
        for(let x=0;x<columnas;x++)
        {
            if(datos[y][x].disponible==true)
            {
                let mayorHorizontal= IndiceMayor(datos,y,'fila');
                let mayorVertical= IndiceMayor(datos,x,'columna');
                let ct=mayorHorizontal.costo+mayorVertical.costo-datos[y][x].costo;
                datos[y][x].ct=ct;
            }
        }
    }
}


function imprimirTabla(arreglo, titulo) {
    console.log('imprimiendo tabla');
    let cadena = "<hr/><div class='row'><h6> paso:" + titulo + "</h6> <div class='col l8 offset-l2'> \
      <table class='centered highlight stripped'><thead><th></th> ";
    for (let x = 0; x < columnas; x++) { // agrega los headers de cada tabla
        cadena += "<th>B" + x + "</th>";
    }
    cadena += "<th>Oferta</th></thead><tbody>";
    for (let y = 0; y < filas; y++) { //agrega las variables 
        cadena += "<tr><td>A" + y + "</td>";
        for (let x = 0; x < columnas; x++) {
            if (arreglo[y][x].disponible == false && arreglo[y][x].valor == 0) {
                cadena += "<td>ct:"+arreglo[y][x].ct+" <label for=''>costo" + arreglo[y][x].costo + "</label></br>X</td>";
            }
            else {
                cadena += "<td>ct:"+arreglo[y][x].ct+" <label for=''>costo" + arreglo[y][x].costo + "</label></br>" + arreglo[y][x].valor + "</td>";
            }
        }
        cadena += "<td>" + arreglo[y][columnas].oferta + "</td></tr>";
    }
    cadena += "<tr><td>Demanda</td>";
    for (let x = 0; x < columnas; x++) { // agrega los headers de cada tabla
        cadena += "<td>" + arreglo[filas][x].demanda + "</td>";
    }
    cadena = cadena + "<td>" + suma + "/" + suma + "</td></tr></body></table></div></div>";
    $('#tablas ').append(cadena);

}

function imprimirRespuesta(arreglo) {
    let cadena = "";
    let respuesta = 0;
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            if (datos[y][x].valor > 0) {
                respuesta += datos[y][x].costo * datos[y][x].valor;
                cadena += "<h6 style='display:inline;'>" + datos[y][x].valor + "(" + datos[y][x].costo + ")+</h6>";
            }
        }
    }
    cadena.slice(0, -6)
    cadena += "</h6><h6 style='display:inline;'>=" + respuesta + "</h6>";
    $("#Respuesta").append(cadena);
}