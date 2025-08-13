const express = require('express');
const app = express();
const { Client: Client2 } = require('discord.js-selfbot-v13');
const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { parentId, probot_ids, recipientId, price } = require('./config.js');
const cooldowns1 = new Map();
const cooldowns2 = new Map();
const cooldowns = new Map();


// ملحوظة : قبل لا تشغل البروجكت نزل بكج discord.js وايضا بكج discord.js-selfbot-v13 
// وأيضا قم بوضع توكن البوت في سطر 26 وايضا في اخر سطر بالمشروع  وايضا اي دي كاتجوري التكتات في سطر 94 وايضا في ملف config.js

const client = new Client({
  intents: 3276799
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');



client.on('ready', () => {
  console.log((`✅ Logged in as ${client.user.tag}`));

  const rest = new REST({ version: 10 }).setToken("توكن بوتك");
  const commands = [
    {
      name: 'send-ticket',
      description: 'Send a ticket message',
    },
  ];

  (async () => {
    try {
      console.log(`Registering slash commands...`);

      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

      console.log(`Slash commands were registered successfully!`);
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  })();
}); 

process.on('unhandledRejection', (err) => console.error(err));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'send-ticket') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
  
      const embed = new EmbedBuilder()
        .setTitle('Clone Ticket')
          .setDescription(`لشراء نسخ سيرفر افتح التكت بالاسفل واتبع مايقوله البوت مع العلم اننا لانحتفظ ب اي معلومات

    البوت ينسخ
    الرولات
    الرومات
    الصلاحيات
   الكاتجوريات
    الايموجيات
    السعر : 20 الف كريدت
    `)
    
          .setColor('#00ff00')
    .setTimestamp();

        const button = new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('لشراء نسخ')
          .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(button);
        await interaction.channel.send({ embeds: [embed], components: [row] }); 
    

}
});
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'create_ticket') {
    const cooldownKey = `${interaction.user.id}-${interaction.guild.id}`;
    if (cooldowns.has(cooldownKey)) {
      const cooldown = cooldowns.get(cooldownKey);
      const remainingTime = (cooldown - Date.now()) / 1000;
      return interaction.reply({ content: `Please wait ${remainingTime.toFixed(1)} seconds before creating another ticket.`, ephemeral: true });
    }
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0,
      parent: " ",// اي دي الكاتجوري حق التكتات
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    const embed = {
      title: 'Ticket',
      description: 'Click the button below to close the ticket',
      color: 0x00ff00,
    
};
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
      .setCustomId('cliam_ticket')
      .setLabel('Cliam Ticket')
      .setStyle(ButtonStyle.Primary)
    
    )
    
    
    await channel.send({ content: `<@${interaction.user.id}>`
,embeds: [embed], components: [row] });
    interaction.reply({ content: `Your ticket has been created in ${channel}`, ephemeral: true });
    cooldowns.set(cooldownKey, Date.now() + 5000);
    setTimeout(() => {
      cooldowns.delete(cooldownKey);
    }, 5000);
  }
});
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'close_ticket') {
    const channel = interaction.channel;
    const embed = {
      title: 'Ticket',
      description: 'Are you sure you want to close this ticket?',
      color: 0xff0000,
    };
    const button1 = new ButtonBuilder()
      .setCustomId('confirm_close_ticket')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success);
    const button2 = new ButtonBuilder()
      .setCustomId('cancel_close_ticket')
      .setLabel('No')
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(button1, button2);
    await interaction.reply({ embeds: [embed], components: [row] });
  }
});
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'confirm_close_ticket') {
    const channel = interaction.channel;
    await channel.delete();
  } else if (interaction.customId === 'cancel_close_ticket') {
    const embed = {
      title: 'Ticket',
      description: 'Ticket close cancelled.',
      color: 0x00ff00,
    
  };
    await interaction.update({ embeds: [embed], components: [] });
  
}
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'cliam_ticket') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
    }
    const channel = interaction.channel;
    const embed = {
      title: 'Ticket',
      description: 'This ticket has been cliamed by <@' + interaction.user.id + '>',
      color: 0x00ff00,
    };
     

    await channel.send({ embeds: [embed] });
      
      
    interaction.update({

      components: [

        {

          type: 1,
          components: [

            {

              type: 2,

              style: 3,

              label: `تم استلم من قبل ${interaction.user.tag}`,

              custom_id: "appr_btn_inta",

              disabled: true,

            },
            

          ],

        },

      ],

    });
      

      
      
      

   }
   });
    

              

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    
    if (interaction.customId === 'confirm-' && cooldowns.get(interaction.message.id) && !cooldowns2.has(interaction.user.id)) {
        const {
        user,
        token,
        id,
        id2
      } = cooldowns.get(interaction.message.id);

      if (user !== interaction.user.id) return;

      await interaction.deferReply({
        ephemeral: true
      });
      const client2 = new Client2({
        checkUpdate: false
      });

      try {
        await client2.login(token);

      } catch {
        return interaction.editReply('هذا التوكن غير صحيح');
      }

      const guild = client2.guilds.cache.get(id);
      const guild2 = client2.guilds.cache.get(id2);

      if (!guild) return interaction.editReply('انت لست موجود في الخادم الأول');
      if (!guild2) return interaction.editReply('انت لست موجود في الخادم التاني');
      if (guild.id === guild2.id || !guild2.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply('لا يمكن نسخ هذا السيرفر');

      await cooldowns2.set(interaction.user.id);
      await interaction.editReply(`\`\`\`#credit ${recipientId} ${price}\`\`\``);

      let done = false;
      const price1 = price === 1 ? 1 : Math.floor(price * 0.95);
      const filter = message => probot_ids.includes(message.author.id) && message.content.includes(`${price1}`) & message.content.includes(`${recipientId}`) && message.content.includes(`${interaction.user.username}`);
      const pay = await interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 3e5
      });

      pay.once('collect', async () => {
        done = true;
        interaction.editReply('**جاري النسخ ..**');

        for (const [, channel] of guild2.channels.cache) {
          await channel.delete().catch(() => {});
        }

        for (const [, role] of guild2.roles.cache) {
          await role.delete().catch(() => {});
        }

        for (const [, emoji] of guild2.emojis.cache) {
          await emoji.delete().catch(() => {});
        }

        const roles = new Map();
        const categories = new Map();

        const guildRoles = [...guild.roles.cache.values()].sort((a, b) => a.rawPosition - b.rawPosition);

        const guildCategories = [...guild.channels.cache.filter((channel) => channel.type === 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);
        const guildChannels = [...guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);

        for (const role of guildRoles) {
          try {
            if (role.id === guild.roles.everyone.id) {
              await guild2.roles.everyone.setPermissions(role.permissions.toArray());

              interaction.channel.send('1 - تم تحديث رتبة Everyone');
              roles.set(role.id, guild2.roles.everyone);
              continue;
            }

            const createdRole = await guild2.roles.create({
              name: role.name,
              position: role.rawPosition,
              color: role.color,
              hoist: role.hoist,
              mentionable: role.mentionable,
              permissions: role.permissions.toArray(),
            });

            console.log(`Created Role: ${createdRole.name}`);
            roles.set(role.id, createdRole);

          } catch {
            console.error(`Failed to create role: ${role.name}`);
          }
        }

        interaction.channel.send('2 - تم الإنتهاء من الرولات');

        for (const category of guildCategories) {
          try {
            const permissionOverwrites = [];

            for (const [, overwrite] of category.permissionOverwrites.cache) {
              const role = roles.get(overwrite.id);

              if (role) {
                permissionOverwrites.push({
                  id: role.id,
                  allow: overwrite.allow.toArray(),
                  deny: overwrite.deny.toArray()
                });
              }
            }

            const createdCategory = await guild2.channels.create(category.name, {
              type: 'GUILD_CATEGORY',
              permissionOverwrites
            });

            console.log(`Created Category: ${createdCategory.name}`);
            categories.set(category.id, createdCategory);

          } catch {
            console.error(`Failed to create category: ${category.name}`);
          }
        }

        interaction.channel.send('3 - تم الإنتهاء من الكاتجوري');

        for (const channel of guildChannels) {
          try {
            const permissionOverwrites = [];
            const type = channel.type === 'GUILD_TEXT' ? 'GUILD_TEXT' : channel.type === 'GUILD_VOICE' ? 'GUILD_VOICE' : 'GUILD_TEXT';
            const parent = channel.parentId ? categories.get(channel.parentId) : null;

            for (const [, overwrite] of channel.permissionOverwrites.cache) {
              const role = roles.get(overwrite.id);

              if (role) {
                permissionOverwrites.push({
                  id: role.id,
                  allow: overwrite.allow.toArray(),
                  deny: overwrite.deny.toArray()
                });
              }
            }

            const createdChannel = await guild2.channels.create(channel.name, {
              type,
              permissionOverwrites,
              parent
            });

            console.log(`Created Channel: ${createdChannel.name}`);

          } catch {
            console.error(`Failed to create channel: ${channel.name}`);
          }
        }

        interaction.channel.send('4 - تم الإنتهاء من القنوات');

        for (const [, emoji] of guild.emojis.cache) {
          const createdEmoji = await guild2.emojis.create(emoji.url, emoji.name);

          console.log(`Created emoji: ${createdEmoji.name}`);
        }

        interaction.deleteReply();

        cooldowns1.delete(interaction.user.id);
        cooldowns2.delete(interaction.user.id);

        interaction.channel.send('5 - تم الإنتهاء من الايموجي');
        interaction.channel.send('تم الإنتهاء من الجميع!');
      });

      pay.once('end', () => {
        if (done) return;

        cooldowns1.delete(interaction.user.id);
        cooldowns2.delete(interaction.user.id);
        interaction.editReply('**انتهى وقت التحويل**');
      });
    }

    if (interaction.customId === 'confirm' && !cooldowns1.has(interaction.user.id)) {
      const modal = new ModalBuilder()
        .setCustomId('server-modal')
        .setTitle('Copy Server');

      const token = new TextInputBuilder()
        .setCustomId('token')
        .setMinLength(1)
        .setPlaceholder('Ex: MTAwMTYxMTQ1MTIwMDQ0NjUyNQ.GBQUgg.Js0Dpx89iHG3TqrZV2Opg73vPtU9jnDd-jtEYY')
        .setStyle(TextInputStyle.Short)
        .setLabel('توكن الحساب');

      const id = new TextInputBuilder()
        .setCustomId('id')
        .setMinLength(1)
        .setPlaceholder('Ex: 936974185421475864')
        .setStyle(TextInputStyle.Short)
        .setLabel('معرف الخادم (Server ID To Copy)');

      const id2 = new TextInputBuilder()
        .setCustomId('id2')
        .setMinLength(1)
        .setPlaceholder('Ex: 1115277371193438362')
        .setStyle(TextInputStyle.Short)
        .setLabel('معرف الخادم (Server ID To Paste)');

      const row = new ActionRowBuilder().addComponents(token);
      const row1 = new ActionRowBuilder().addComponents(id);
      const row2 = new ActionRowBuilder().addComponents(id2);

      modal.addComponents(row, row1, row2);
      interaction.showModal(modal);
    }

    if (interaction.customId === 'cancel') {
      cooldowns1.delete(interaction.user.id);
      cooldowns2.delete(interaction.user.id);
      interaction.channel.delete();
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'server-modal' && !cooldowns1.has(interaction.user.id)) {
      const token = interaction.fields.getTextInputValue('token');
      const id = interaction.fields.getTextInputValue('id');
      const id2 = interaction.fields.getTextInputValue('id2');

      await interaction.deferReply({
        ephemeral: true
      });
      const client2 = new Client2({
        checkUpdate: false
      });

      try {
        await client2.login(token);

      } catch {
        return interaction.editReply('هذا التوكن غير صحيح');
      }
      
      const guild = client2.guilds.cache.get(id);
      const guild2 = client2.guilds.cache.get(id2);

      /*if (guild.id.startsWith('1304581864010551326')) { // اي دي سيرفرك

        return interaction.editReply('انقلع اكيد مابتنسخ سيرفرنا');

      }*/
      if (!guild) return interaction.editReply('انت لست موجود في الخادم الأول');
      if (!guild2) return interaction.editReply('انت لست موجود في الخادم التاني');
      if (guild.id === guild2.id || !guild2.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply('لا يمكن نسخ هذا السيرفر');
    

      await cooldowns1.set(interaction.user.id);
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('confirm-')
        .setStyle(ButtonStyle.Success)
        .setLabel('Confirm'),
        new ButtonBuilder()
        .setCustomId('cancel')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Cancel'));

      const msg = await interaction.editReply({
        content: `هل أنت متأكد ان تريد نسخ ${guild.name}؟`,
        components: [row]
      });

      cooldowns.set(msg.id, {
        user: interaction.user.id,
        token,
        id,
        id2
      });
    }
  }
});

client.on('channelCreate', (channel) => {
  if (channel.parentId === parentId) {
    setTimeout(async () => {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('confirm')
          .setStyle(ButtonStyle.Success)
          .setLabel('Confirm'),
        new ButtonBuilder()
          .setCustomId('cancel')
          .setStyle(ButtonStyle.Secondary)
          .setLabel('Cancel'));

      channel.send({
        content: `**

شكرا ل استخدامك خدمتنا الرجاء القراءة جيدا : 

* نحن لا نحتفظ ب اي معلومات.

*فكرة البوت انو بدل متخش بروجكت ريبل ات و تسوي وتستخدم بوت بدل منه و اسرع.

*البوت بينسخ ( رتب ، ايموجيات ، قنوات ، صلاحيات ) 

* كيف اجيب توكن الخاص بي ؟ شاهد الفديو ذا 👇 : 

https://media.discordapp.net/attachments/1151956242760212500/1162042586966528000/lv_0_20231012175825.mp4?ex=653a7f7e&is=65280a7e&hm=8ebc9dc9129716a8eb92a8aaff4dec4f41fa2bf065c4d1caa3a5c9c878fef6c2&

**`,
        components: [row]
      });
    }, 2500);
  }
});



client.login("توكن بوتك");