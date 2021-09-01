console.log("[DevJosué] Flappy Bird");

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = "./efeitos/hit.wav";

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x + planoDeFundo.largura,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );
  },
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x,
        chao.y,
        chao.largura,
        chao.altura
      );

      contexto.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x + chao.largura,
        chao.y,
        chao.largura,
        chao.altura
      );
    },
  };
  return chao;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

// [FlappyBird]
function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,

    pulo: 4.6,
    pula() {
      flappyBird.velocidade = -flappyBird.pulo;
    },

    velocidade: 0,
    gravidade: 0.25,
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        som_HIT.play();

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + this.velocidade;
    },

    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa pra baixo
      { spriteX: 0, spriteY: 26 }, // asa no meio
    ],
    frameAtual: 0,
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },

    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = this.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites, // image

        spriteX, // sprite X
        spriteY, // sprite Y

        flappyBird.width, // sprite Width
        flappyBird.height, // sprite Height,

        flappyBird.x, // dentro do canvas X
        flappyBird.y, // dentro do canvas Y

        flappyBird.width, // dentro do canvas Width
        flappyBird.height // dentro do canvas Height
      );
    },
  };

  return flappyBird;
}

// [messageGetReady]
const messageGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      messageGetReady.sX,
      messageGetReady.sY,
      messageGetReady.w,
      messageGetReady.h,
      messageGetReady.x,
      messageGetReady.y,
      messageGetReady.w,
      messageGetReady.h
    );
  },
};

//
// [Telas]
//
const globais = {};

let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      messageGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  },
};

// Game
function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
