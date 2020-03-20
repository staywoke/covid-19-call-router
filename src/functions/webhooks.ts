import express from 'express';
import createServerlessHandler from 'serverless-http';
import { createRouter } from '../router';

const NETLIFY_PATH_PREFIX = '/.netlify/functions/webhooks';

export const handler = createServerlessHandler(
  express().use(
    NETLIFY_PATH_PREFIX,
    createRouter(NETLIFY_PATH_PREFIX),
  ),
);
