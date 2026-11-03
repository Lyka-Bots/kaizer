const activeGames = new Map();

const WIN_REWARD = 100;
const TIE_REWARD = 25;

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = [
        "A", "2", "3", "4", "5", "6", "7",
        "8", "9", "10", "J", "Q", "K"
    ];

    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                rank,
                suit,
                value:
                    rank === "A" ? 1 :
                    ["J", "Q", "K", "10"].includes(rank) ? 0 :
                    Number(rank)
            });
        }
    }

    return deck.sort(() => Math.random() - 0.5);
}

function getPoints(cards) {
    return cards.reduce((total, card) => total + card.value, 0) % 10;
}

function showCards(cards) {
    return cards.map(card => `${card.rank}${card.suit}`).join("  ");
}

module.exports = {
    config: {
        name: "lucky9",
        aliases: ["lucky9", "l9"],
        version: "1.0.0",
        author: "Edward",
        countDown: 3,
        role: 0,
        description: {
            en: "Play Lucky 9 card game and earn coins."
        },
        category: "games",
        guide: {
            en:
                "{pn} - Start a Lucky 9 game\n" +
                "{pn} hit - Draw another card\n" +
                "{pn} stand - Finish your turn\n" +
                "{pn} status - View your current cards\n" +
                "{pn} cancel - Cancel your game"
        }
    },

    onStart: async function ({
        message,
        event,
        args,
        usersData
    }) {
        const userID = event.senderID;
        const action = (args[0] || "").toLowerCase();

        let game = activeGames.get(userID);

        // START GAME
        if (!action) {
            if (game) {
                return message.reply(
                    "You already have an active game!\n" +
                    "Use 'cards hit' or 'cards stand'."
                );
            }

            const deck = createDeck();

            game = {
                deck,
                player: [deck.pop(), deck.pop()],
                dealer: [deck.pop(), deck.pop()]
            };

            activeGames.set(userID, game);

            const playerPoints = getPoints(game.player);

            if (playerPoints === 9) {
                return finishGame(
                    message,
                    userID,
                    game,
                    usersData
                );
            }

            return message.reply(
                "🃏 LUCKY 9\n" +
                "━━━━━━━━━━━━━━━━\n" +
                "👤 YOUR CARDS\n" +
                `${showCards(game.player)}\n` +
                `⭐ Your Points: ${playerPoints}\n\n` +
                "🏦 DEALER'S CARDS\n" +
                `${game.dealer[0].rank}${game.dealer[0].suit}  ❓\n` +
                "⭐ Dealer Points: Hidden\n" +
                "━━━━━━━━━━━━━━━━\n" +
                "Choose your action:\n" +
                "➕ hit - Draw another card\n" +
                "✋ stand - Keep your cards"
            );
        }

        if (!game) {
            return message.reply(
                "You don't have an active game.\n" +
                "Use 'cards' to start a new game."
            );
        }

        // VIEW STATUS
        if (action === "status") {
            return message.reply(
                "🃏 YOUR GAME STATUS\n" +
                "━━━━━━━━━━━━━━━━\n" +
                `Your Cards: ${showCards(game.player)}\n` +
                `Your Points: ${getPoints(game.player)}\n\n` +
                `Dealer's Visible Card: ${game.dealer[0].rank}${game.dealer[0].suit}\n` +
                "━━━━━━━━━━━━━━━━"
            );
        }

        // CANCEL GAME
        if (action === "cancel") {
            activeGames.delete(userID);

            return message.reply(
                "Your Lucky 9 game has been cancelled."
            );
        }

        // HIT
        if (action === "hit") {
            const newCard = game.deck.pop();
            game.player.push(newCard);

            const points = getPoints(game.player);

            if (points === 9) {
                return finishGame(
                    message,
                    userID,
                    game,
                    usersData
                );
            }

            return message.reply(
                "🃏 CARD DRAWN!\n" +
                "━━━━━━━━━━━━━━━━\n" +
                `New Card: ${newCard.rank}${newCard.suit}\n\n` +
                `Your Cards: ${showCards(game.player)}\n` +
                `Your Points: ${points}\n` +
                "━━━━━━━━━━━━━━━━\n" +
                "Use 'cards hit' to draw again.\n" +
                "Use 'cards stand' to finish."
            );
        }

        // STAND
        if (action === "stand") {
            while (getPoints(game.dealer) < 6) {
                game.dealer.push(game.deck.pop());
            }

            return finishGame(
                message,
                userID,
                game,
                usersData
            );
        }

        return message.reply(
            "Invalid action!\n\n" +
            "Available commands:\n" +
            "cards hit\n" +
            "cards stand\n" +
            "cards status\n" +
            "cards cancel"
        );
    }
};

async function finishGame(message, userID, game, usersData) {
    const playerPoints = getPoints(game.player);
    const dealerPoints = getPoints(game.dealer);

    let result = "";
    let reward = 0;

    if (playerPoints > dealerPoints) {
        result = "🎉 YOU WIN!";
        reward = WIN_REWARD;
    } else if (playerPoints === dealerPoints) {
        result = "🤝 IT'S A TIE!";
        reward = TIE_REWARD;
    } else {
        result = "😢 DEALER WINS!";
    }

    if (reward > 0) {
        const userData = await usersData.get(userID);

        userData.money =
            Number(userData.money || 0) + reward;

        await usersData.set(userID, userData);
    }

    activeGames.delete(userID);

    return message.reply(
        "🃏 LUCKY 9 RESULTS\n" +
        "━━━━━━━━━━━━━━━━\n" +
        `👤 YOUR CARDS:\n${showCards(game.player)}\n` +
        `⭐ Your Points: ${playerPoints}\n\n` +
        `🏦 DEALER'S CARDS:\n${showCards(game.dealer)}\n` +
        `⭐ Dealer Points: ${dealerPoints}\n` +
        "━━━━━━━━━━━━━━━━\n" +
        `${result}\n` +
        (reward > 0
            ? `💰 Coins Earned: +${reward}\n`
            : "💰 Coins Earned: +0\n") +
        "━━━━━━━━━━━━━━━━\n" +
        "Thanks for playing Lucky 9!"
    );
      }
