const getTelegramConfig = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "Telegram уведомления отключены: не заданы TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID"
    );
    return null;
  }

  return { token, chatId };
};

export const sendTelegramMessage = async (text: string): Promise<void> => {
  const config = getTelegramConfig();

  if (!config) {
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${config.token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${body}`);
  }
};
