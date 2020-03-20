import app from './app';
import { parseConfig } from './config';

const config = parseConfig(process.env);

app.listen(config.server.port);
console.log(`Listening on port ${config.server.port}`);
