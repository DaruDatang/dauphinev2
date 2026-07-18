import express from 'express';
import cors from 'cors';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  },
});

app.get('/api/analytics', async (req, res) => {
  const range = req.query.range || '7days';
  let startDate = '7daysAgo';
  if (range === '30days') startDate = '30daysAgo';
  if (range === '90days') startDate = '90daysAgo';

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'bounceRate' }
      ],
    });

    let totalViews = 0;
    let totalSessions = 0;
    let totalBounceRate = 0;
    let rowCount = 0;
    const pagesMap = {};
    const sourcesMap = {};

    if (response.rows) {
      response.rows.forEach(row => {
        const pagePath = row.dimensionValues[0].value;
        const sourceName = row.dimensionValues[1].value;
        const views = parseInt(row.metricValues[1].value, 10);
        const sessions = parseInt(row.metricValues[2].value, 10);
        const bounce = parseFloat(row.metricValues[3].value);

        totalViews += views;
        totalSessions += sessions;
        if (!isNaN(bounce)) {
          totalBounceRate += bounce;
          rowCount++;
        }

        if (!pagesMap[pagePath]) {
          pagesMap[pagePath] = { path: pagePath, views: 0, unique: 0 };
        }
        pagesMap[pagePath].views += views;
        pagesMap[pagePath].unique += parseInt(row.metricValues[0].value, 10);

        if (!sourcesMap[sourceName]) {
          sourcesMap[sourceName] = { name: sourceName, count: 0 };
        }
        sourcesMap[sourceName].count += sessions;
      });
    }

    const topPages = Object.values(pagesMap)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const totalSourceSessions = Object.values(sourcesMap).reduce((acc, curr) => acc + curr.count, 0);
    const sources = Object.values(sourcesMap).map(source => ({
      name: source.name,
      count: source.count,
      percentage: totalSourceSessions > 0 ? Math.round((source.count / totalSourceSessions) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    res.json({
      activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || 0, 10),
      totalViews,
      sessions: totalSessions,
      bounceRate: rowCount > 0 ? `${Math.round((totalBounceRate / rowCount) * 100)}%` : '0%',
      sources,
      topPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));