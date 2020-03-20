import express from 'express';
import { createRouter } from './router';

export default express().use(createRouter());
