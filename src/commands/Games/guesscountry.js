import { SlashCommandBuilder } from 'discord.js';
import { infoEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { GuessCountryService } from '../../services/guessCountryService.js';

export default {
    data: new SlashCommandBuilder()
        .setName("guesscountry")
        .setDescription("Play Guess the Country")
        .addSubcommand(sub =>
            sub
                .setName("start")
                .setDescription("Start a Guess the Country game")
        ),

    category: "Games",

    async execute(interaction) {
        try {

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "start") {

                const game = GuessCountryService.startGame();

                await InteractionHelper.universalReply(interaction, {
                    embeds: [
                        infoEmbed(
                            "🌍 Guess the Country!",
                            `⚽ **Football Fact**\n${game.footballFact}

🏆 **Capital**
${game.capital}

💰 **Currency**
${game.currency}

⭐ **Starts With**
${game.name.charAt(0)}

⏰ You have **60 seconds!**

Type your answer in chat!`
                        )
                    ]
                });

            }

        } catch (error) {
            await handleInteractionError(interaction, error);
        }
    }
};
