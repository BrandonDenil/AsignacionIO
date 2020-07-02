var suma = 0;
//resuelve 
function resolver() {
    $("#tablas div").remove();
    obtenerDatos();
    imprimirTabla(datos,'inicio');
    // console.log(hallarCosto());
    if(verificarSolucion()==true)
    {
        let con=0;
           while(con<10)
           {    
               console.log(datos);
                let ind=hallarCosto();
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

// devuelve el indice x,y de la penalizacion de una fila
function penalizacionFila(matriz) {
    let listaTemp = [];

    for (let y = 0; y < filas; y++) {
        let num1 = null;
        let num2 = null;
        for (let x = 0; x < columnas; x++) {
            if ((matriz[y][x].disponible == true) && (num1 == null)) {
                num1 = { "costo": matriz[y][x].costo, "indice": x } //busca el primer numero disponible
            }

        }
        if (num1 != null) // si existe algun costo disponible
        {
            for (let x = 0; x < columnas; x++) {
                if (matriz[y][x].disponible == true) {
                    if (num1.costo > matriz[y][x].costo) {
                        num1 = { "costo": matriz[y][x].costo, "indice": x } // compara hasta hallar el menor
                    }
                }
            }
            for (let x = 0; x < columnas; x++) {
                if ((matriz[y][x].disponible == true) && (num1.indice != x)) {
                    num2 = { "costo": matriz[y][x].costo, "indice": x } // busca el segundo numero disponible
                }

            }
            if (num2 != null) // si el numero2 no es nulo
            {
                for (let x = 0; x < columnas; x++) {
                    if ((matriz[y][x].disponible == true) && (num1.indice != x) && (num2.indice != x)) {
                        if (matriz[y][x].costo < num2.costo) {
                            num2 = { "costo": matriz[y][x].costo, "indice": x }// compara hasta hallar el segundo menor 
                        }
                    }
                }
                listaTemp.push((num2.costo - num1.costo));
            }
            else // si numero2 es nulo o no existe agregar unicamente el numero1
            {
                listaTemp.push(num1.costo);
            }
        }
        else // si no existen costos disonfilasibles retorna null
        {
            listaTemp.push(null);
        }
    }

    return listaTemp;
}
// devuelve el indice x,y  de la penalizacion de una fila
function penalizacionColumna(matriz) {
    let listaTemp = [];

    for (let x = 0; x < columnas; x++) {
        let num1 = null;
        let num2 = null;
        for (let y = 0; y < filas; y++) {
            if ((matriz[y][x].disponible == true) && (num1 == null)) {
                num1 = { "costo": matriz[y][x].costo, "indice": y } //busca el primer numero disponible
            }

        }
        if (num1 != null) // si existe algun costo disponible
        {
            for (let y = 0; y < filas; y++) {
                if (matriz[y][x].disponible == true) {
                    if (num1.costo > matriz[y][x].costo) {
                        num1 = { "costo": matriz[y][x].costo, "indice": y } // compara hasta hallar el menor
                    }
                }
            }
            for (let y = 0; y < filas; y++) {
                if ((matriz[y][x].disponible == true) && (num1.indice != y)) {
                    num2 = { "costo": matriz[y][x].costo, "indice": y } // busca el segundo numero disponible
                }

            }
            if (num2 != null) // si el numero2 no es nulo
            {
                for (let y = 0; y < filas; y++) {
                    if ((matriz[y][x].disponible == true) && (num1.indice != y) && (num2.indice != y)) {
                        if (matriz[y][x].costo < num2.costo) {
                            num2 = { "costo": matriz[y][x].costo, "indice": y }// compara hasta hallar el segundo menor 
                        }
                    }
                }
                listaTemp.push((num2.costo - num1.costo));
            }
            else // si numero2 es nulo o no existe agregar unicamente el numero1
            {
                listaTemp.push(num1.costo);
            }
        }
        else // si no existen costos disonibles retorna null
        {
            listaTemp.push(null);
        }
    }

    return listaTemp;
}

//halla la casilla que se utilizara 
function hallarCosto() {
    let listaX = penalizacionColumna(datos);
    let listaY = penalizacionFila(datos);
    let mayorY = mayorLista(listaY);
    let mayorX = mayorLista(listaX);
    console.log(listaX);
    console.log(listaY);
    if ((mayorY != null) || (mayorX != null)) 
    {
        if (mayorX.penalizacion < mayorY.penalizacion) { 
            console.log('fila');
            return IndiceMinimo(datos, mayorY.indice, "fila"); //retorna el costo maas pequeño de las penalizaciones verticales
        }
        else if (mayorX.penalizacion > mayorY.penalizacion) { 
            console.log('columna');
            return IndiceMinimo(datos, mayorX.indice, "columna"); //retorna el costo maas pequeño de las penalizaciones horizontales
        }
        else if (mayorX.penalizacion == mayorY.penalizacion) {  //retorna el costo maas pequeño de las penalizaciones cuando hay un empata ubusca el menor
            console.log('empate entre penalizaciones');
            let a= IndiceMinimo(datos, mayorY.indice, "fila");
            let b= IndiceMinimo(datos, mayorX.indice, "columna");
            if(a.costo>b.costo)
            {
                return IndiceMinimo(datos, mayorY.indice, "fila");
            }
            else if(a.costo<b.costo)
            {
                return IndiceMinimo(datos, mayorX.indice, "columna");
            }
            else
            {
                return IndiceMinimo(datos, mayorY.indice, "fila");
            }
        }
        else{}
    }
    else 
    {   

        return "no hay casillas disponibles";
    }
}

// busca el minimo de un matriz por fila o columna
function IndiceMinimo(matriz, indice, modo) {
    console.log('indice:' + indice + ' modo:' + modo);
    if (modo == "fila") 
    {   
        let min;
        for (let c = 0; c < columnas; c++) 
        {
            if ((matriz[indice][c].disponible == true)) {
                min = { 'costo': matriz[indice][c].costo, 'y': indice, 'x': c };
            }
        }
        
        for (let c = 0; c < columnas; c++) 
        {
            if ((min.costo > matriz[indice][c].costo) && (matriz[indice][c].disponible == true)) {
                min = { 'costo': matriz[indice][c].costo, 'y': indice, 'x': c };
            }
        }
        console.log('retorno de la casilla a usar:');
        console.log(min);
        return min;
    }
    else if (modo == "columna") {
        for (let c = 0; c < columnas; c++) 
        {
            if ((matriz[c][indice].disponible == true)) {
                min = { 'costo': matriz[c][indice].costo, 'y': c, 'x': indice };
            }
        }
        for (let c = 0; c < columnas; c++) 
        {
            if ((min.costo > matriz[c][indice].costo) && (matriz[c][indice].disponible == true)) {
                min = { 'costo': matriz[c][indice].costo, 'y': c, 'x': indice };
            }
        }
        console.log('retorno de la casilla a usar:');
        console.log(min);
        return min;
    }

}

//busca el mayor de una lista
function mayorLista(arreglo) {
    let max = null;
    for (let c = 0; c < arreglo.length; c++) {
        if ((arreglo[c] != null) && (max == null)) {
            max = { 'penalizacion': arreglo[c], 'indice': c }
        }
    }
    if (max != null) {
        for (let c = 0; c < arreglo.length; c++) {
            if (max.penalizacion < arreglo[c]) {
                max = { 'penalizacion': arreglo[c], 'indice': c }
                console.log('nuevo valor de penalizacion mayor:' + max.penalizacion);
            }
        }

        return max;
    }
    else {

        return null;
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
                cadena += "<td> <label for=''>" + arreglo[y][x].costo + "</label></br>X</td>";
            }
            else {
                cadena += "<td> <label for=''>" + arreglo[y][x].costo + "</label></br>" + arreglo[y][x].valor + "</td>";
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