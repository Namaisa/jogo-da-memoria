// variáveis iniciadas
const FRONT = "frente";
const BACK = "tras";
const CARD = "carta";
const ICON = "icon";

let gameOverLayer = document.getElementById("gameOver");

// essa função se inicializa ao carregar página
startGame();

function startGame() {  
    // passamos a função de criar os cards direto como argumento, ela já funciona e entra na outra função
    initializeCards(game.createCardsFromTechs());   
}

// essa função cria cards direto pelo js, usando os dados do objeto game
function initializeCards(cards) {
    let gameBoard = document.getElementById("containerJogo");
    // isso faz com que ao reiniciar o jogo o gameboard já esteja vazio 
    gameBoard.innerHTML = ''; 

    // esse forEach fará com que, para cada card criado pelo game, seja criado um card no html
    cards.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;

        // chamamos a função para criar as faces do card, que são elementos filhos de card
        createCardContent(card, cardElement);

        // determina que ao clicar será chamada a função flipcard, que vira as cartas
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    })
}

function createCardContent(card, cardElement) {
    // para cada card criado, criamos as duas faces, duas divs no html
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
    // aqui criamos as divs de face 
    let cardElementFace = document.createElement('div');
    // e adicionamos a classe face
    cardElementFace.classList.add(face); 

    // aqui diferenciamos as ações para cada face
    if (face === FRONT) {
        // adicionamos o elemento img
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        // adicionamos o endereço da imagem, que vai variar de acordo com o card
        iconElement.src = `./images/${card.icon}.png`

        cardElementFace.appendChild(iconElement);
    } else {
        // inserimos conteúdo dentro da tag
        cardElementFace.innerHTML = "&lt/&gt";
    }
    // criamos a face do cartão
    element.appendChild(cardElementFace);
}

function flipCard() {
    // determina que se a função setcard for concluída, deve-se adicionar a classe flip no elemento clicado
    // aqui o this é o elemento clicado
    if (game.setCard(this.id)){
        this.classList.add("flip");
    } 
    
    // condiciona para acontecer apenas se a segunda carta já estiver chamada
    if (game.secondCard) {
        // chama função checkmatch e caso seja true faz ações
        if (game.checkMatch()) {
            // chama função para limpar cartas da jogada
            game.clearCards();
            // chama função para verificar se jogo acabou
            if (game.checkGameOver()) {
                // mostra tela de fim de jogo
                gameOverLayer.style.display = "flex";
            }
        // se cartas não forem iguais, desviram as cartas dentro de um intervalo de tempo            
        } else {
           setTimeout(() => {
                // procura as cartas no html pelo id                
                let firstCardView = document.getElementById(game.firstCard.id);
                let secondCardView = document.getElementById(game.secondCard.id);
                
                // desvira cartas retirando classe flip
                firstCardView.classList.remove('flip');
                secondCardView.classList.remove('flip');

                game.unflipCards();                                   
            }, 700);           
        }
    }
}

function restart() {
    // esvazia as cartas do jogo
    game.cards = [];

    // esconde tela de fim de jogo    
    gameOverLayer.style.display = "none";

    startGame();   
}
