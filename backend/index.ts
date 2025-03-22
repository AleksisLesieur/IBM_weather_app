import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/places', async (req: any, res: any) => {
  try {
    const response = await fetch('https://api.meteo.lt/v1/places');

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API responded with status: ${response.status}`,
        message: response.statusText,
      });
    }

    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);

    return res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

app.post('/cityForecast', async (req: Request, res: Response) => {
  try {
    const fetchedData = await fetch(`https://api.meteo.lt/v1/places/${req.body.cityCode}/forecasts/long-term`);

    const forecastData = await fetchedData.json();

    res.status(200).json(forecastData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.post('/cityName', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;
    const now = new Date();
    const date = now.toDateString();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    console.log(`on ${date} at ${hours}:${minutes} the city named ${cityName} was clicked`);

    res.status(200).json({ message: 'user click saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
