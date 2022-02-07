/** @format */

import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
	constructor(client: WAClient, handler: MessageHandler) {
		super(client, handler, {
			command: "ayush",
			aliases:['ay'],
			description: "Displays the info",
			category: "general",
			usage: `${client.config.prefix}chitoge`,
			baseXp: 200,
		});
	}

	run = async (M: ISimplifiedMessage): Promise<void> => {
		const chitoge =
			"https://media.tenor.com/videos/e42d08c99c477396dd5a9a2daa36b792/mp4";
		return void this.client.sendMessage(
			M.from,
			{ url: chitoge },
			MessageType.video,
			{
				quoted: M.WAMessage,
				mimetype: Mimetype.gif,
				caption: `🌟 *Chitoge* 🌟\n\n🍀 *Description: A WhatsApp Bot With Rich Anime Features.*\n\n🌐 *URL: https://github.com/monarch21/AYUSH-BOT* \n\n 📒 *Guide: https://github.com/monarch21/AYUSH-LUCIFER-Guides* \n`,
			}
		);
	};
}
