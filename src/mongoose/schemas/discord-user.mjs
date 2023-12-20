import mongoose from "mongoose";

const DiscordUserSchema = new mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	discordId: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
});

export const DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
