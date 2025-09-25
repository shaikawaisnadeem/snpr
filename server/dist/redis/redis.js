import { createClient } from 'redis';
export const redisClient = createClient();
redisClient.on('error', console.error);
await redisClient.connect();
//# sourceMappingURL=redis.js.map