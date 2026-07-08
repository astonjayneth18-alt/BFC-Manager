import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { ModerationService } from '../../services/moderationService.js';
import { handleInteractionError, TitanBotError, ErrorTypes } from '../../utils/errorHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName("nickname")
        .setDescription("Change a member's nickname")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member whose nickname you want to change")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("nickname")
                .setDescription("Enter the new nickname (or '-' to remove it)")
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    category: "moderation",

    async execute(interaction, config, client) {
        try {
            const member = interaction.options.getMember("target");
            let nickname = interaction.options.getString("nickname");

            if (!member) {
                throw new TitanBotError(
                    "Target not found",
                    ErrorTypes.USER_INPUT,
                    "That user is not in this server."
                );
            }

            if (member.id === interaction.user.id) {
                throw new TitanBotError(
                    "Cannot change own nickname",
                    ErrorTypes.VALIDATION,
                    "You cannot change your own nickname."
                );
            }

            if (member.id === client.user.id) {
                throw new TitanBotError(
                    "Cannot change bot nickname",
                    ErrorTypes.VALIDATION,
                    "You cannot change my nickname using this command."
                );
            }

            if (nickname === "-") {
                nickname = null;
            }

            const result = await ModerationService.nicknameUser({
                guild: interaction.guild,
                member,
                moderator: interaction.member,
                nickname,
            });

            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        `🏷️ **Nickname Updated**`,
                        `**User:** ${member.user.tag}\n` +
                        `**Previous:** ${result.previousNickname}\n` +
                        `**New:** ${nickname ?? "None"}\n` +
                        `**Case ID:** #${result.caseId}`
                    ),
                ],
            });

        } catch (error) {
            logger.error("Nickname command error:", error);
            await handleInteractionError(interaction, error, {
                subtype: "nickname_failed",
            });
        }
    },
};
