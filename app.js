// imports dependencies
const express = require('express');

const { PORT } = require('./config');

// imports local routes file
const metricsRoutes = require('./metrics/metrics.routes');

// creates express server
const app = express();

// redirects calls to appropriate routes
app.use('/v1/metrics', metricsRoutes);

// starts express server
app.listen(PORT, () => console.log(`Express Server listening on http://localhost:${PORT}`));