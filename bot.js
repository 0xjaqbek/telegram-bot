const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot token and group chat ID
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const groupId = 'YOUR_GROUP_CHAT_ID'; // Use '@groupusername' or the numeric group ID

const bot = new TelegramBot(token, { polling: true });

/**
 * Function to generate a one-time-use invite link
 * @returns {Promise<String>} The invite link
 */
async function generateOneTimeLink() {
    try {
        // Make a request to Telegram to create a one-time invite link
        const response = await axios.post(`https://api.telegram.org/bot${token}/createChatInviteLink`, {
            chat_id: groupId,
            expire_date: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
            member_limit: 1 // One-time-use
        });

        const inviteLink = response.data.result.invite_link;
        return inviteLink;
    } catch (error) {
        console.error('Error generating invite link:', error);
        return null;
    }
}

// Listen for /start command to generate an invite link
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const inviteLink = await generateOneTimeLink();

    if (inviteLink) {
        bot.sendMessage(chatId, `Here is your one-time-use invite link: ${inviteLink}`);
    } else {
        bot.sendMessage(chatId, 'Sorry, I could not generate an invite link. Please try again later.');
    }
});
