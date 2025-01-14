import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'react2',
            description: `Let's React`,
            aliases: [
                'r2',
                'anoying',
                'lazy',
                'request',
                'flirting',
                'embarrassed',
                'happybirthday',
                'stressed'
            ],  
            category: 'fun',
            usage: `${client.config.prefix}(reaction) [tag/quote users]\nExample: ${client.config.prefix}pat`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        // make key value pairs of reactions like this: { 'bully': 'bullied', 'cuddle': 'cuddled', ... }
        // Access raw text of message
        const action = M.content?.split(' ')[0].slice(1).toLowerCase() || ''
        let flag = true
        if (!(action === 'r' || action === 'react')) {
            flag = false
        }
        const Reactions = {
          anoying: ['anoying at'],
          lazy: ['too lazy ryt now'],
          request: ['requesting please to '],
          flirting: ['flirting with'],
          embarrassed: ['too embarrasing'],
          happybirthday: ['happy birthday to you from all of us side we wish you achieve every goal in your life'],
          stressed: ['too stressed']
        } as unknown as { [key: string]: string[] }
        // take the first argument and make it lowercase
        const term = flag ? joined.split(' ')[0].toLowerCase() : action
        let text = ''
        // map over reactions and add index + reaction to text
        Object.keys(Reactions).map((reaction) => {
            text += `📍${reaction.charAt(0).toUpperCase() + reaction.slice(1)}\n`
            // if index is multiple of 3, add a new line, else give 10 - length of the reaction spaces
            // index % 3 === 2 ? (text += '\n') : (text += ' '.repeat(10 - reaction.length))
        })
        text += `🎀 *Usage:* ${this.client.config.prefix}(reaction) [tag/quote users]\nExample: ${this.client.config.prefix}pat`
        if (flag) {
            if (!term) return void M.reply(`🪧 *OPTIONS:*\n${text}`)
            if (!Object.keys(Reactions).includes(term))
                return void M.reply(
                    `✖  No Reaction Found 🧧\nUse ${this.client.config.prefix}r to see all available reactions`
                )
        }
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) M.mentioned.push(M.sender.jid)
        // remove duplicate mentions
        M.mentioned = [...new Set(M.mentioned)]
        let grammar: string
        M.mentioned[0] === M.sender.jid
            ? (grammar = Reactions[`${term}`].pop() || Reactions[`${term}`][0])
            : (grammar = Reactions[`${term}`][0])
        M.reply(
            await this.client.util.GIFBufferToVideoBuffer(
                await this.client.getBuffer(
                    (
                        await this.client.fetch<{ url: string }>(`https://api.waifu.pics/sfw/${term}`)
                    ).url
                )
            ),
            MessageType.video,
            Mimetype.gif,
            [M.sender.jid, ...M.mentioned],
            `*@${M.sender.jid.split('@')[0]} ${grammar} ${M.mentioned
                .map((user) => (user === M.sender.jid ? 'Themselves' : `@${user.split('@')[0]}`))
                .join(', ')}*`
        )
    }
}
