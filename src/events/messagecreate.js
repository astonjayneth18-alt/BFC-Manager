import { GuessCountryService } from "../services/guessCountry.js";

export default {
    name: "messageCreate",

    async execute(message) {

        if (message.author.bot) return;

        const game = GuessCountryService.getCurrentGame();

        if (!game) return;

        if (GuessCountryService.checkAnswer(message.content)) {

            await message.reply(
                `🎉 Congratulations ${message.author}!\n\n✅ The correct answer was **${game.name}**!`
            );

            GuessCountryService.endGame();
        }

    }
};
