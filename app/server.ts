'use strict';

import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import { setupInsights } from './insights'

setupInsights()

export const startServer = async (): Promise<Server> => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
    });

    await server.register(require('./plugins/router'))
    
    await server.start();

    if(process.env.NODE_ENV !== 'test'){
        console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    }
    return server;
};