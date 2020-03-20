import createServerlessHandler from 'serverless-http';
import app from '../app';

export const handler = createServerlessHandler(app);
