const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const tokens = [
    'MTU1NjI2MDE5ODY2NDkwMDY5OA.Gtsx-2.jnlQ2pNadxguKmMz0qekKbKrNewCkPFMx8nxR8', // التوكن حقك
];

const channelIds = [
    '1521735154647699516', // آي دي الروم الصوتي
];

tokens.forEach((token, index) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    const connectToVoice = async () => {
        try {
            const channelId = channelIds[index];
            if (!channelId) return;

            const channel = await client.channels.fetch(channelId);
            if (channel && channel.isVoiceBased()) {
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: true,
                    selfMute: true
                });

                // مراقبة الاتصال ولو طلع البوت لأي سبب يرجع يدخل تلقائياً بعد 5 ثواني
                connection.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'disconnected') {
                        console.log(`[-] انقطع اتصال البوت، جاري إعادة الدخول...`);
                        setTimeout(connectToVoice, 5000);
                    }
                });

                console.log(`[+] البوت دخل الروم الصوتي بنجاح وثبت فيها.`);
            }
        } catch (error) {
            console.error(`[-] خطأ في دخول البوت للروم:`, error.message);
        }
    };

    client.once('ready', async () => {
        console.log(`[+] البوت اشتغل بنجاح باسم: ${client.user.tag}`);
        connectToVoice();
    });

    client.login(token).catch(err => {
        console.error(`[-] فشل تسجيل دخول البوت:`, err.message);
    });
});