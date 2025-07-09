// Telegram Bot API integration for Elite users
export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface TelegramMessage {
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
}

// Send message to Telegram channel/group
export const sendTelegramMessage = async (
  config: TelegramConfig, 
  message: string
): Promise<boolean> => {
  try {
    if (!config.botToken || !config.chatId) {
      throw new Error('Telegram bot token and chat ID are required');
    }

    // Validate bot token format
    if (!config.botToken.match(/^\d+:[A-Za-z0-9_-]+$/)) {
      throw new Error('Invalid Telegram bot token format');
    }

    // Validate chat ID format (can be negative for groups/channels)
    if (!config.chatId.match(/^-?\d+$/)) {
      throw new Error('Invalid Telegram chat ID format');
    }

    const telegramApiUrl = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    
    const payload: TelegramMessage = {
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    };

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        ...payload
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }

    console.log('✅ Message sent to Telegram successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error);
    throw error;
  }
};

// Test Telegram configuration
export const testTelegramConfig = async (config: TelegramConfig): Promise<boolean> => {
  try {
    const testMessage = `🤖 *AI Trader Test Message*\n\nYour Telegram integration is working correctly!\n\n⏰ ${new Date().toLocaleString()}`;
    await sendTelegramMessage(config, testMessage);
    return true;
  } catch (error) {
    console.error('Telegram test failed:', error);
    return false;
  }
};

// Get bot information (for validation)
export const getTelegramBotInfo = async (botToken: string): Promise<any> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    
    if (!response.ok) {
      throw new Error('Invalid bot token');
    }

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.description || 'Failed to get bot info');
    }

    return result.result;
  } catch (error) {
    console.error('Failed to get bot info:', error);
    throw error;
  }
};

// Get chat information (for validation)
export const getTelegramChatInfo = async (config: TelegramConfig): Promise<any> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get chat info');
    }

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.description || 'Invalid chat ID or bot not added to chat');
    }

    return result.result;
  } catch (error) {
    console.error('Failed to get chat info:', error);
    throw error;
  }
};

// Telegram setup instructions
export const getTelegramSetupInstructions = () => {
  return {
    title: "Telegram Integration Setup (Elite Feature)",
    steps: [
      "1. Create a Telegram Bot:",
      "   • Open Telegram and search for @BotFather",
      "   • Send /newbot command",
      "   • Choose a name and username for your bot",
      "   • Copy the bot token (format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)",
      "",
      "2. Get Your Chat ID:",
      "   • Add your bot to your group/channel",
      "   • Make the bot an admin (for channels)",
      "   • Send a message in the group",
      "   • Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates",
      "   • Find your chat ID in the response (negative number for groups)",
      "",
      "3. Configure in Settings:",
      "   • Go to Settings → Telegram Integration",
      "   • Enter your bot token and chat ID",
      "   • Test the connection",
      "   • Save your settings",
      "",
      "4. Start Sending Signals:",
      "   • Generate a trading signal",
      "   • Click 'Send to Telegram' button",
      "   • Your analysis will be sent to your configured channel"
    ],
    note: "This feature is exclusive to Elite plan users. The bot will send formatted trading signals with all analysis details to your Telegram channel."
  };
};

// Format trading signal for Telegram
export const formatSignalForTelegram = (
  signal: any,
  analysis: string,
  school: string
): string => {
  const timestamp = new Date().toLocaleString();
  let message = `🤖 *AI Trading Signal*\n\n`;
  
  if (signal) {
    const typeEmoji = signal.type === 'buy' ? '🟢' : signal.type === 'sell' ? '🔴' : '🟡';
    message += `${typeEmoji} *${signal.type.toUpperCase()}* ${signal.pair}\n\n`;
    
    message += `📊 *SIGNAL DETAILS:*\n`;
    if (signal.entry) message += `📍 Entry: \`${signal.entry}\`\n`;
    if (signal.stopLoss) message += `🛑 Stop Loss: \`${signal.stopLoss}\`\n`;
    if (signal.takeProfit1) message += `🎯 TP1: \`${signal.takeProfit1}\`\n`;
    if (signal.takeProfit2) message += `🎯 TP2: \`${signal.takeProfit2}\`\n`;
    if (signal.probability) message += `📈 Probability: \`${signal.probability}%\`\n`;
    
    // Calculate Risk:Reward if possible
    if (signal.entry && signal.stopLoss && signal.takeProfit1) {
      const risk = Math.abs(signal.entry - signal.stopLoss);
      const reward = Math.abs(signal.takeProfit1 - signal.entry);
      const ratio = (reward / risk).toFixed(2);
      message += `⚖️ Risk:Reward: \`1:${ratio}\`\n`;
    }
    
    message += `\n📚 *Method:* ${school}\n`;
    message += `⏰ *Generated:* ${timestamp}\n\n`;
  }
  
  message += `📋 *ANALYSIS:*\n`;
  // Clean up analysis for Telegram (remove markdown conflicts)
  const cleanAnalysis = analysis
    .replace(/\*\*/g, '*')
    .replace(/#{1,6}\s/g, '*')
    .substring(0, 3000); // Telegram message limit
  
  message += `${cleanAnalysis}\n\n`;
  message += `⚠️ *Risk Warning:* Trading involves substantial risk. This is for educational purposes only.\n\n`;
  message += `🔗 Generated by AI Trader Platform`;
  
  return message;
};