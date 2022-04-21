import alt from 'alt-server';
import * as chat from 'chat';
import { ObjectId } from 'mongodb';
import { db, connect } from 'db';

alt.on('resourceStart', () => {
  connect();
});

alt.on('playerConnect', async (player) => {
  const user = await db().collection('users').findOne();
  const characterId = user.characters[0];
  const character = await db().collection('characters').findOne({ "_id": ObjectId(characterId) });

  player.setMeta('characterId', characterId);
  player.model = `mp_m_freemode_01`;
  player.spawn(character.pos, 0);
});

alt.on('playerDisconnect', (player) => {
  const pos = player.pos;

  var newvalues = { $set: { pos } };
  db().collection('characters').updateOne({ "_id": ObjectId(player.getMeta('characterId')) }, newvalues);
});

chat.registerCmd('position', (player) => {
  alt.log(player.pos);
});
