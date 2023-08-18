import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import User from './models/User.mjs';
import formatDate from './utils.mjs';
import { libList, links, nodeJsList, nodeLinks } from './data.mjs';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
const bot = new TelegramBot(process.env.TG_TOKEN, {
  polling: {
    interval: 500,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

const app = express();
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log(`${err} Error when server start`);
    process.exit(1);
  }

  await bot.setMyCommands([
    {
      command: '/start',
      description: 'Початок',
    },
    {
      command: '/about',
      description: 'Опис',
    },
    {
      command: '/active_users',
      description: 'Активні користувачі',
    },
    {
      command: '/profile',
      description: 'Ваш профіль',
    },
    {
      command: '/faq',
      description: 'Питання та пропозиції',
    },
  ]);
};

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  try {
    const user = await User.findOne({ chatId });
    if (user) {
      await user.updateOne({
        operationCount: parseInt(user.operationCount) + 1,
      });
    }

    if (text === '/start') {
      const user = await User.findOne({ name: msg.from.first_name });
      if (!user) {
        const newUser = new User({
          name: msg?.from?.first_name,
          chatId,
        });
        await newUser.save();
      }
      await mutex.runExclusive(async () => {
        const message = 'Оберіть категорію:';
        const keyboard = [
          [{ text: 'React', callback_data: 'react' }],
          [{ text: 'NodeJs', callback_data: 'nodejs' }],
        ];

        await bot.sendSticker(
          chatId,
          'https://tlgrm.eu/_/stickers/6a3/497/6a34971d-6648-37c2-8f2b-8940f65ba906/256/8.webp'
        );
        await bot.sendMessage(
          chatId,
          `Привіт ${msg.from.first_name}, Вас вітає DD-bot. Тут ти знайдешь не тільки корисну інформацію, але й можешь зробити пошук через youtube потрібної інформації. Просто напиши команду @youtube та підключись. Тепер ти можешь користуватись YouTube просто ввівши цю же команду в боті. Приємного користування !`
        );

        await bot.sendMessage(chatId, message, {
          reply_markup: {
            inline_keyboard: keyboard,
          },
        });
      });
    } else if (text === '/about') {
      await mutex.runExclusive(async () => {
        await bot.sendSticker(
          chatId,
          'https://tlgrm.ru/_/stickers/ab3/3b6/ab33b6ea-9e45-3bad-b9f6-8f07f81b6bd4/14.jpg'
        );
        await bot.sendMessage(
          chatId,
          `Ти знаходишься в телеграм боті який допоможе знайти потрібний фреймворк або лібу для швидкої розробки твого сайту. Якщо чогось не знайшов, або хочешь додати клікай /faq та звертайся до мене, я завжди на зв'язку. Нові технології по троху додаються, перевіряются на актуальність та оновлюються.`
        );
      });
    } else if (text === '/faq') {
      await mutex.runExclusive(async () => {
        await bot.sendMessage(
          chatId,
          'Напишіть вашу пропозицію або питання нашому розробнику:',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Linkedin',
                    url: 'https://www.linkedin.com/in/dmitry-moskalenko-69a19a226/',
                  },
                  {
                    text: 'Telegramm',
                    url: 'https://t.me/Dmitry_Mass',
                  },
                ],
              ],
            },
          }
        );
      });
    } else if (text === '/profile') {
      const user = await User.findOne({ chatId });
      if (!user) {
        return;
      }
      const date = formatDate(user.createdAt);
      const markDown = `
        _Ваш профіль :_
        _Ім'я:_  *${user.name}*
        _Здійснені операції:_  *${user.operationCount}*
        _Створений:_ *${date}*
      `;
      await mutex.runExclusive(async () => {
        await bot.sendSticker(
          chatId,
          'https://cdn.tlgrm.app/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/192/1.webp'
        );
        await bot.sendMessage(chatId, markDown, { parse_mode: 'Markdown' });
      });
    } else if (text === '/active_users') {
      const activeUser = await User.find();
      if (!activeUser) {
        return;
      }
      const markDown = `
        _Наразі активних користувачів:_  *${activeUser.length}*
      `;

      await mutex.runExclusive(async () => {
        await bot.sendSticker(
          chatId,
          'https://cdn.tlgrm.app/stickers/6a3/497/6a34971d-6648-37c2-8f2b-8940f65ba906/192/5.webp'
        );
        await bot.sendMessage(chatId, markDown, { parse_mode: 'Markdown' });
      });
    } else if (msg.via_bot.username === 'youtube') {
      await mutex.runExclusive(async () => {
        await bot.sendMessage(chatId, 'Тримайте корисне відео.');
      });
    } else {
      await mutex.runExclusive(async () => {
        await bot.sendMessage(
          chatId,
          'Не розумію вашої команди, мабудь її не існує або ви помилились. Виберіть категорію, або просто ії напишіть (наприклад /start).'
        );
      });
    }
  } catch (err) {
    console.error(err);
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  const user = await User.findOne({ chatId });
  if (user) {
    await user.updateOne({
      operationCount: parseInt(user.operationCount) + 1,
    });
  }

  if (data === 'react') {
    const message = 'Оберіть категорію:';
    return bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: libList,
      },
    });
  }

  if (data === 'nodejs') {
    const message = 'Оберіть категорію:';
    return bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: nodeJsList,
      },
    });
  }

  if (
    [
      'State',
      'Router',
      'UI / Styles',
      'Fetch Data',
      'Forms / Validation',
      'Animation',
      'Testing',
      'Additional',
    ].includes(data)
  ) {
    const message = `Ви обрали категорію ${data}.`;
    const keyboard = links[data].map((link) => [
      { text: link.text, url: link.url },
    ]);

    return bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  if (['Frame / Lib', 'Auth', 'DB / ORM', 'Additional'].includes(data)) {
    const message = `Ви обрали категорію ${data}.`;
    const keyboard = nodeLinks[data].map((link) => [
      { text: link.text, url: link.url },
    ]);
    return bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }
});

app.all('*', (req, res) => {
  res.json({ 'every thing': 'is awesome' });
});

start().then(() => {
  app.listen(process.env.PORT || 5005, () => {
    console.log(`Bot start on port ${process.env.PORT}`);
  });
});
