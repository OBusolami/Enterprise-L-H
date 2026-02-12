const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Learning Hub API is running');
});

const resourceRoutes = require('./routes/resources');
const teamRoutes = require('./routes/teams');

app.use('/api/resources', resourceRoutes);
app.use('/api/teams', teamRoutes);
// Re-using the logic from resources router for standalone metadata endpoint if preferred, 
// or access it via /api/resources/metadata if structured that way. 
// However, in my resources.js implementation, I put /metadata INSIDE resourceRoutes.
// But wait, express router matching:
// router.get('/metadata', ...) inside resourceRoutes which is mounted at /api/resources
// yields /api/resources/metadata.
// This works perfectly.

// Export the Express API
module.exports = app;

// Only listen if run directly (local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
