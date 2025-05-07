const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajusta para o personagem ficar proximo ao chao

const margemChao = 50; 
const alturaChao = canvas.height - margemChao; 
// Coloca a imagem do jogador

const imagemJogador = new Image();
imagemJogador.src = 'jerry.png';

// Variável pontuação do jogador
let pontuacao = 0;

// Cria um objeto jogador
const jogador = {
  posicaoX: 50,
  posicaoY: alturaChao - 150, // altura do jogador (ajustado para mais perto do chão)
  largura: 150,
  altura: 150,
  mudaVertical: 0,
  gravidade: 1.5,
  forcaPulo: -35,
  estaPulando: false
};

// Cria um objeto inimigo
const inimigo = {
  largura: 150,
  altura: 150,
  posicaoX: canvas.width - 200, // Posição à direita
  posicaoY: alturaChao - 150 // Mesmo nível do chão
};

// Cria o inimigo do jogador
const imagemInimigo = new Image();
imagemInimigo.src = 'tom.png';

// Função que desenha o inimigo
function desenhaInimigo() {
  ctx.drawImage(imagemInimigo, inimigo.posicaoX, inimigo.posicaoY, inimigo.largura, inimigo.altura);
}

// Cria um fundo
const imagemFundo = new Image();
imagemFundo.src = 'planoDeFundo.jpg';

const planoDeFundo = {
  largura: canvas.width,
  altura: canvas.height,
  x1: 0,
  x2: -canvas.width, 
  velocidade: 1.5,
  imagem: imagemFundo
};

function desenhaFundo() {
  ctx.drawImage(planoDeFundo.imagem, Math.floor(planoDeFundo.x1), 0, planoDeFundo.largura, planoDeFundo.altura);
  ctx.drawImage(planoDeFundo.imagem, Math.floor(planoDeFundo.x2), 0, planoDeFundo.largura, planoDeFundo.altura);

  planoDeFundo.x1 += planoDeFundo.velocidade;
  planoDeFundo.x2 += planoDeFundo.velocidade;

  if (planoDeFundo.x1 >= canvas.width) {
    planoDeFundo.x1 = planoDeFundo.x2 - planoDeFundo.largura;
  }
  if (planoDeFundo.x2 >= canvas.width) {
    planoDeFundo.x2 = planoDeFundo.x1 - planoDeFundo.largura;
  }
}

let obstaculos = [];
let frame = 0;

document.addEventListener('keydown', function(pulo) {
  if (pulo.code === 'Space' && !jogador.estaPulando) {
    jogador.mudaVertical = jogador.forcaPulo;
    jogador.estaPulando = true;
  }
});

function desenhaPersonagem() {
  ctx.drawImage(imagemJogador, jogador.posicaoX, jogador.posicaoY, jogador.largura, jogador.altura);
}

const imagemObstaculo = new Image();
imagemObstaculo.src = 'ratueira.png';

// Função para desenhar os obstáculos (paçocas)
function desenhaObstaculo() {
  for (let obs of obstaculos) {
    ctx.drawImage(imagemObstaculo, obs.x, obs.y, obs.width, obs.height);
  }
}

// Função para gerar os obstáculos (paçocas) sendo "lançadas"
function gerarObstaculo() {
  obstaculos.push({
    x: inimigo.posicaoX + inimigo.largura, // Começa do lado do inimigo
    y: inimigo.posicaoY + 50, // Lançado a partir do corpo do inimigo
    width: 70,
    height: 60,
    velocidade: -5 // A "paçoca" vai em direção ao jogador
  });
}

// Função para atualizar a posição dos obstáculos
function updateObstaculo() {
  for (let obs of obstaculos) {
    obs.x += obs.velocidade;
  }

  obstaculos = obstaculos.filter(obs => obs.x + obs.width > 0);

  if (frame % 150 === 0) { // A cada 150 quadros, o inimigo lança uma "paçoca"
    gerarObstaculo();
  }
}

function desenhaPontuacao() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + pontuacao, 20, 40);
}

function updateJogador() {
  jogador.mudaVertical += jogador.gravidade;
  jogador.posicaoY += jogador.mudaVertical;

  const limiteChao = alturaChao - jogador.altura;

  if (jogador.posicaoY >= limiteChao) {
    jogador.posicaoY = limiteChao;
    jogador.mudaVertical = 0;
    jogador.estaPulando = false;
  }
}

function verificaColisao() {
  const margemJogador = 20; // margem interna para hitbox do jogador
  const margemObstaculo = 10; // margem interna para hitbox dos obstáculos

  for (let obs of obstaculos) {
    if (
      jogador.posicaoX + margemJogador < obs.x + obs.width - margemObstaculo &&
      jogador.posicaoX + jogador.largura - margemJogador > obs.x + margemObstaculo &&
      jogador.posicaoY + margemJogador < obs.y + obs.height - margemObstaculo &&
      jogador.posicaoY + jogador.altura - margemJogador > obs.y + margemObstaculo
    ) {
      alert("Você perdeu !");
      document.location.reload();
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  desenhaFundo();
  desenhaPersonagem();
  desenhaInimigo();
  desenhaObstaculo();
  desenhaPontuacao();

  updateJogador();
  updateObstaculo();
  verificaColisao();

  pontuacao++;
  frame++;
  requestAnimationFrame(gameLoop);
}

gameLoop();