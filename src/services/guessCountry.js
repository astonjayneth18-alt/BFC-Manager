import countries from "../data/countries.json" assert { type: "json" };

export class GuessCountryService {

    static currentGame = null;

    static startGame() {

        const random =
            countries[Math.floor(Math.random() * countries.length)];

        this.currentGame = random;

        return random;
    }

    static getCurrentGame() {
        return this.currentGame;
    }

    static checkAnswer(answer) {

        if (!this.currentGame) return false;

        return (
            answer.trim().toLowerCase() ===
            this.currentGame.name.toLowerCase()
        );
    }

    static endGame() {
        this.currentGame = null;
    }

}
