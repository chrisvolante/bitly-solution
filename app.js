const express = require('express');

const { PORT } = require('./config');

const metricsRoutes = require('./metrics/metrics.routes');

const app = express();

app.use('/v1/metrics', metricsRoutes);

app.listen(PORT, () => console.log(`Express Server listening on http://localhost:${PORT}`));