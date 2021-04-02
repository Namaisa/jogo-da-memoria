let game = {   
    techs: ['bootstrap', 'css', 'electron', 'firebase', 'html', 'javascript', 'jquery', 'mongo', 'node', 'react'],
    cards: [],
    /* o lockMode foi criado para retornar true quando viramos a segunda carta 
    e depois ser usado como condicional para virar ou não novas cartas */
    lockMode: false,
    firstCard: null, // isso significa que o objeto ainda não tem nada
    secondCard: null,

    // esse método é chamado no start game
    createCardsFromTechs: function() {
        // esse for each vai chamar a função para criar o par de cartas
        this.techs.forEach((tech) => {
            this.cards.push(this.createPairFromTech(tech));
        })

        // aqui eu tiro os objetos pares dos arrays e os objetos ficam soltos dentro do array carta 
        // o flat map busca todos os objeros dentro de um array
        this.cards =  this.cards.flat();
        // esse método embaralha as cartas
        this.shuffleCards();
        return this.cards;
    },

    // nesse método é criado um array com dois objetos com as características das cartas
    // esse array é inserido no array cards, no for each que chamou essa função
    // o tech vai ser referente a cada tecnologia passada no for each que chamou esse método
    createPairFromTech: function (tech) {
        return [{
            // esse método vai criar a id com o nome da tecnologia e um número aleatório menor que mil
            id: this.createIdWithTech(tech),
            icon: tech,
            flipped: false,
        }, {
            id: this.createIdWithTech(tech),
            icon: tech,
            flipped: false,
        }]   
    },

    createIdWithTech: function (tech) {
        return tech + parseInt(Math.random() * 1000);
    },

    // !essa função não entendeu o this enquanto arrow function
    shuffleCards: function() {
        let currentIndex = this.cards.length;
        let randomIndex = 0;

        while (currentIndex != 0) {
            // cria um número aleatório dentro da quantidade de objetos que ainda não foram embaralhados         
            randomIndex = Math.floor(Math.random() * currentIndex);
            
            currentIndex--;
            
            // isso fará com que o card citado primeiro troque de lugar no array com o segundo card citado
            [this.cards[randomIndex], this.cards[currentIndex]] = [this.cards[currentIndex], this.cards[randomIndex]];
            // não é necessário retornar nada pois aqui ele realmente troca a posição dos elementos dentro do array (não copia)
        }
    },
    
    // método diz para o front end se carta já foi virada
    setCard: function(id) {   

        // inicia a variável card como a carta com o id em questão (da carta clicada)
        let card = this.cards.filter(card => card.id == id)[0];
        
        // determina que se a carta já estiver virada ou se já tem 2 cartas viradas
        if (card.flipped || this.lockMode) {
            return false;
        }

        // determina que se a primeira carta estiver vazia a carta clicada será a primeira carta
        if (!this.firstCard) {
            this.firstCard = card;
            // carta flipped da primeira carta fica como true
            this.firstCard.flipped = true;
            // set card avisa que já foi virado
            return true;
        // determina que, se a primeira carta estiver cheia a carta clicada será a segunda
        } else {
            this.secondCard = card;
            this.secondCard.flipped = true;
            // tabuleiro fica trancado até cartas desvirarem
            this.lockMode = true;
            return true;
        }
    },

    // verifica se o icon das duas cartas é igual
    checkMatch: function() {
        // retornamos direto pois dará como verdadeiro / falso   
        return (this.firstCard.icon == this.secondCard.icon);
    },

    clearCards: function() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockMode = false;
    },

    unflipCards: function() {
        this.firstCard.flipped = false;
        this.secondCard.flipped = false;
        this.clearCards();
    },

    checkGameOver: function(){
        // verifica se todas as cartas já foram jogadas (nenhuma carta estará com flipado em true)
        /* a princípio não há nenhuma carta com flipado em true, mas a partir do momento em que 
        clicamos para executar essas ações sempre há pelo menos 1 carta flipada */
        return this.cards.filter(card => !card.flipped).length == 0;
    },

}
