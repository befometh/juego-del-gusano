const lienzo = document.querySelector("#lienzo");
const lapiz = lienzo.getContext("2d");
const unit = lienzo.height / 19;
const limX=119;
const limY=18;
const velBase=500;
var direccion = 0;
class Cuerpa{
    constructor(x,y){
        this.x=x;
        this.y=y;        
    }
}
var gusano = [];
var manzana = new Cuerpa(0,0);

/**
 * 
 * @param {Coordenada en X} x 
 * @param {Coordenada en Y} y 
 */

function construirGusano(x,y){
    for(let i=0;i<3;i++){
        gusano.push(new Cuerpa(x-i,y));
        dibujarCuadrado(gusano[i],"red");
    }
    let elemento = JSON.stringify(gusano);
    console.log(`Constructor: ${elemento}`);
    crearManzana();
}

function crearManzana(){
    manzana.x=Math.floor(Math.random()*limX);
    manzana.y=Math.floor(Math.random()*limY);
    cont=0;
    while(cont<gusano.length&&manzana != gusano[cont]){
        cont++;
    }
    if(cont==gusano.length){
        dibujarCuadrado(manzana,"green");
    }
    else{
        crearManzana();
    }
}

function moverGusano(x,y){
    let temp = gusano;
    let cola = new Cuerpa(temp[temp.length-1].x,temp[temp.length-1].y);
    for(let i=temp.length-1;i>0;i--){
        temp[i].x=temp[i-1].x;
        temp[i].y=temp[i-1].y;
    }
    temp[0].x+=x;
    temp[0].y+=y;
    dibujarCuadrado(cola,"white");
    console.log(temp);
    let cabeza = JSON.stringify(temp[0]);
    console.log(`Cabeza: ${cabeza}`)
    let estaManzana = JSON.stringify(manzana);
    console.log(`Manzana: ${estaManzana}`);
    gusano=temp;
}

function dibujarGusano(){
    for(let i of gusano){
        dibujarCuadrado(i,"red");
    }
}

function dibujarCuadrado(ubicacion,estado){
    lapiz.fillStyle = estado;
    lapiz.fillRect(unit*ubicacion.x,unit*ubicacion.y,unit,unit);
}

function moverDer(){
    let cabeza=gusano[0].x
    cabeza+=1;
    if(gusano[0].x<limX && cabeza != gusano[1].x){
      moverGusano(1,0);
      dibujarGusano();  
      direccion=0;  
    }
    else if(cabeza == gusano[1].x){
        console.log("Movimiento inválido")
    }
    else{
        dibujarCuadrado(gusano[0],"black");
        console.log("te pasaste")
        gameOver();
    }
}

function moverAbajo(){
    let cabeza=gusano[0].y
    cabeza+=1;
    if(gusano[0].y<limY&&cabeza != gusano[1].y){
      moverGusano(0,1);
      dibujarGusano();  
    }
    else if(cabeza == gusano[1].y){
        console.log("Movimiento inválido")
    }
    else{
        dibujarCuadrado(gusano[0],"black");
        console.log("te pasaste")
        gameOver();
    }
    direccion=1;
}

function moverIzq(){
    let cabeza=gusano[0].x
    cabeza-=1;
    if(gusano[0].x>0&&cabeza != gusano[1].x){
      moverGusano(-1,0);
      dibujarGusano();  
    }
    else if(cabeza == gusano[1].x){
        console.log("Movimiento inválido")
    }
    else{
        dibujarCuadrado(gusano[0],"black");
        console.log("te pasaste")
        gameOver();
    }
    direccion=2;
}

function moverArriba(){
    let cabeza=gusano[0].y
    cabeza-=1;
    if(gusano[0].y>0&&cabeza != gusano[1].y){
      moverGusano(0,-1);
      dibujarGusano();  
    }
    else if(cabeza == gusano[1].y){
        console.log("Movimiento inválido")
    }
    else{
        dibujarCuadrado(gusano[0],"black");
        console.log("te pasaste")
        gameOver();
    }
    direccion=3;
}

function compararAutochoque(){
    let choque = false;
    let cabeza = new Cuerpa (gusano[0].x,gusano[0].y)
    for(let i=1;i<gusano.length;i++){
        if(cabeza.x == gusano[i].x && cabeza.y==gusano[i].y){
            choque=true;
        }
    }
    return choque;
}

let tiempo = setInterval(() => {
    switch(direccion){
        case 0:
            moverDer();
        break;
        case 1:
            moverAbajo();
        break;
        case 2:
            moverIzq();
        break;
        case 3:
            moverArriba();
        break;
        case 4:
            gameOver()
        break;
    }

    if(gusano[0].x == manzana.x && gusano[0].y == manzana.y){
        gusano.push(new Cuerpa(manzana.x,manzana.y));
        crearManzana();
    }
}, velBase/4);

function gameOver(){
    clearTimeout(tiempo);
    window.alert("Juego terminado, perdiste");
    location.reload();
}

