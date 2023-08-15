const FRONT = "card_front";
const BACK = "card_back";
const CARD = "card";
const ICON = "icon";
let inputName = document.getElementById("name");
let nome = '';
let moves = 0;
let player = {
    id: nome,
    moves: moves
};
let players = JSON.parse(localStorage.getItem("players")) || [];

function startGame() {
    nome = inputName.value;

    if (nome != "") {
        initializeCards(game.createCards());
        let playerNameLayer = document.getElementById("playerName");
        let gameBoardLayer = document.getElementById("gameBoard");
        playerNameLayer.style.display = "none";
        gameBoardLayer.style.display = "grid";
    } else {
        alert("Insira um nome para começar");
    }
}

function initializeCards(cards) {
    let gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = '';

    for (let card of game.cards) {
        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;

        createCardContent(card, cardElement);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    }
}

function createCardContent(card, cardElement) {
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);
    if (face == FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = "../images/" + card.icon + ".png";
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = "&lt/&gt";
    }
    element.appendChild(cardElementFace);
}

function flipCard() {
    if (game.setCard(this.id)) {
        this.classList.add("flip");
        if (game.secondCard) {
            moves++;
            if (game.checkMatch()) {
                game.clearCards();
                if (game.checkGameOver()) {
                    let gameOverLayer = document.getElementById("gameOver");
                    gameOverLayer.style.display = 'flex';
                    savePlayer();
                    updateRanking();
                }
            } else {
                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id);
                    let secondCardView = document.getElementById(game.secondCard.id);

                    firstCardView.classList.remove('flip');
                    secondCardView.classList.remove('flip');
                    game.unflipCards();
                }, 1000);
            }
        }
    }
}

function restart() {
    game.clearCards();
    let gameOverLayer = document.getElementById("gameOver");
    let gameBoardLayer = document.getElementById("gameBoard");
    let playerNameLayer = document.getElementById("playerName");
    gameOverLayer.style.display = 'none';
    gameBoardLayer.style.display = "none"
    playerNameLayer.style.display = "block";
    document.getElementById("name").value = '';
    nome = '';
    moves = 0;
}

function savePlayer() {
    player.id = nome;
    player.moves = moves;

    localStorage.setItem("jogador", JSON.stringify(player));
    place();
    player = {};
}

function place() {
    players.push(JSON.parse(localStorage.getItem("jogador")));

    players.sort(function (playerA, playerB) {
        if (playerA.moves > playerB.moves) {
            return 1;
        } else {
            return -1;
        }
    })

    localStorage.setItem("players", JSON.stringify(players));
}

function updateRanking() {
    var tableRow = `
          
    `;

    for (let i = 0; i < JSON.parse(localStorage.getItem("players")).length; i++) {
        tableRow += `
        <tr>
            <td>#${i + 1}</td>
            <td>${players[i].id}</td>
            <td>${players[i].moves}</td>
        </tr>   `
    }

    document.querySelector("#tableRanking>tbody").innerHTML = tableRow;
}

function reset(){
    localStorage.clear();
    players = [];
    document.querySelector("#tableRanking>tbody").innerHTML = '';
}