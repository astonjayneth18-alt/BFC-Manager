import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} from "discord.js";

import { successEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";
import { handleInteractionError } from "../../utils/errorHandler.js";
import { logger } from "../../utils/logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Set or disable slowmode in the current channel")
        .addIntegerOption(option =>
            option
                .setName("seconds")
                .setDescription("Slowmode duration in seconds (0 to disable)")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    category: "moderation",

    async execute(interaction) {
        try {
            const seconds = interaction.options.getInteger("seconds");

            if (interaction.channel.type !== ChannelType.GuildText) {
                return InteractionHelper.universalReply(interaction, {
                    content: "❌ This command only works in text channels.",
                    ephemeral: true,
                });
            }

            await interaction.channel.setRateLimitPerUser(seconds);

            const message =
                seconds === 0
                    ? "🐢 Slowmode has been disabled."
                    : `🐢 Slowmode has been set to **${seconds}** second(s).`;

            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        "Slowmode Updated",
                        message
                    ),
                ],
            });
        } catch (error) {
            logger.error("Slowmode command error:", error);
            await handleInteractionError(interaction, error);
        }
    },
};
