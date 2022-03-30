/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import * as chat from 'chat';

chat.registerCmd('test', (player) => {
    console.log('hello world');
});