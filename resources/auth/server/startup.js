import alt from 'alt-server';
import { db, connect } from './db';

alt.on('resourceStart', () => {
  connect();
});
  
alt.on('playerConnect', async (player) => {
  let user = await db().collection('users').findOne({ socialId: player.socialID });
  player.setMeta('user', user);
});
