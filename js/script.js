const lienzo = document.querySelector("#lienzo");
const lapiz = lienzo.getContext("2d");
const unit = lienzo.height / 19;
const limX = 119;
const limY = 18;
const velBase = 100;
var intermitencia = true;
var direccion = 0;
class Cuerpa {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get getX() {
    return this.x;
  }
  set setX(x) {
    this.x = x;
  }
  get getY() {
    return this.y;
  }
  set setY(y) {
    this.y = y;
  }
  get getXY() {
    return `${this.x},${this.y}`;
  }
}

var gusano = [];
var manzana = new Cuerpa(0, 0);

/**
 *
 * @param {Coordenada en X} x
 * @param {Coordenada en Y} y
 */

function construirGusano(x, y) {
  for (let i = 0; i < 3; i++) {
    gusano.push(new Cuerpa(x - i, y));
    dibujarCuadrado(gusano[i], "red");
  }
  let elemento = JSON.stringify(gusano);
  console.log(`Constructor: ${elemento}`);
  crearManzana();
}

function crearManzana() {
  //var manzana = new Cuerpa(0, 0)
  console.log(manzana.getX);
  let temp = new Cuerpa(manzana.getX, manzana.getY);
  temp.setX = Math.floor(Math.random() * limX);
  temp.setY = Math.floor(Math.random() * limY);
  console.log("este es temp: " + temp);
  cont = 0;
  while (cont < gusano.length && temp.getXY != gusano[cont].getXY) {
    cont++;
  }
  if (cont == gusano.length && temp.getXY != manzana.getXY) {
    manzana.setX = temp.getX;
    manzana.setY = temp.getY;
    dibujarCuadrado(manzana, "green");
  } else {
    crearManzana();
  }
  let estaManzana = JSON.stringify(manzana);
  console.log(`Manzana Creada ${estaManzana}`);
}

function moverGusano(x, y) {
  let temp = gusano;
  let cola = new Cuerpa(temp[temp.length - 1].getX, temp[temp.length - 1].getY);
  for (let i = temp.length - 1; i > 0; i--) {
    temp[i].setX = temp[i - 1].getX;
    temp[i].setY = temp[i - 1].getY;
  }
  temp[0].setX = temp[0].getX + x;
  temp[0].setY = temp[0].getY + y;
  dibujarCuadrado(cola, "white");
  //console.log(temp);
  let cabeza = JSON.stringify(temp[0]);
  //console.log(`Cabeza: ${cabeza}`);
  let estaManzana = JSON.stringify(manzana);
  console.log(`Manzana: ${estaManzana}`);
  gusano = temp;
}

function dibujarGusano() {
  for (let i of gusano) {
    dibujarCuadrado(i, "red");
  }
  if (intermitencia) {
    let cabeza = new Cuerpa(gusano[0].getX, gusano[0].getY);
    dibujarCuadrado(cabeza, "brown");
  }
  intermitencia = !intermitencia;
}

function dibujarCuadrado(ubicacion, estado) {
  lapiz.fillStyle = estado;
  lapiz.fillRect(unit * ubicacion.getX, unit * ubicacion.getY, unit, unit);
}

function moverDer() {
  let cabeza = gusano[0].getX;
  cabeza += 1;
  if (gusano[0].getX < limX && cabeza != gusano[1].getX) {
    moverGusano(1, 0);
    dibujarGusano();
    direccion = 0;
  } else if (cabeza == gusano[1].getX) {
    console.log("Movimiento inválido");
  } else {
    dibujarCuadrado(gusano[0], "black");
    console.log("te pasaste");
    gameOver();
  }
}

function moverAbajo() {
  let cabeza = gusano[0].getY;
  cabeza += 1;
  if (gusano[0].getY < limY && cabeza != gusano[1].getY) {
    moverGusano(0, 1);
    dibujarGusano();
    direccion = 1;
  } else if (cabeza == gusano[1].getY) {
    console.log("Movimiento inválido");
  } else {
    gameOver();
  }
}

function moverIzq() {
  let cabeza = gusano[0].getX;
  cabeza -= 1;
  if (gusano[0].getX > 0 && cabeza != gusano[1].getX) {
    moverGusano(-1, 0);
    dibujarGusano();
    direccion = 2;
  } else if (cabeza == gusano[1].getX) {
    console.log("Movimiento inválido");
  } else {
    gameOver();
  }
  compararManzana();
}

function moverArriba() {
  let cabeza = gusano[0].getY;
  cabeza -= 1;
  if (gusano[0].getY > 0 && cabeza != gusano[1].getY) {
    moverGusano(0, -1);
    dibujarGusano();
    direccion = 3;
  } else if (cabeza == gusano[1].getY) {
    console.log("Movimiento inválido");
  } else {
    gameOver();
  }
  compararManzana();
}

function compararAutochoque() {
  let choque = false;
  let cabeza = new Cuerpa(gusano[0].getX, gusano[0].getY);
  for (let i = 2; i < gusano.length - 1; i++) {
    if (cabeza.getXY == gusano[i].getXY) {
      choque = true;
      gameOver();
    }
  }
  return choque;
}

function compararManzana() {
  if (gusano[0].getXY == manzana.getXY) {
    gusano.push(new Cuerpa(manzana.getX, manzana.getY));
    crearManzana();
  }
}

let tiempo = setInterval(() => {
  switch (direccion) {
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
      gameOver();
      break;
  }
  compararManzana();
  compararAutochoque();
}, velBase);

let escucharTeclado = addEventListener("keypress", (e) => {
  switch (e.code) {
    case "KeyD":
      moverDer();
      break;
    case "KeyS":
      moverAbajo();
      break;
    case "KeyA":
      moverIzq();
      break;
    case "KeyW":
      moverArriba();
      break;
  }
  compararManzana();
  compararAutochoque();
});

function gameOver() {
    clearTimeout(tiempo);
    dibujarCuadrado(gusano[0], "black");
    setTimeout(()=>{
                window.alert("Juego terminado, perdiste");
                location.reload();
    },100);
}
