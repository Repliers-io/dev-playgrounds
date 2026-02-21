# Repliers API Playgrounds

## Hosted Version

You can find a hosted version of Repliers Playgrounds at <https://playgrounds.repliers.com/>

Get your Free [Test API Key](https://help.repliers.com/en/article/understanding-test-api-keys-1bmol07/) by signing up at [Repliers Customer Portal](https://login.repliers.com/). You will immdiately get access to [Sample Data](https://help.repliers.com/en/article/accessing-our-sample-data-for-prototyping-purposes-14ddh9z/) and you can start testing [Repliers APIs](https://docs.repliers.io/reference/getting-started-1) right away.

Fork the repo and see what you can do with Repliers APIs at your localhost.

## Run Playgrounds locally

Tech Stack: React + TypeScript + Vite

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:Repliers-io/dev-playgrounds.git
   cd dev-playgrounds
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file based on the provided `env.example` template:

   ```bash
   cp env.example .env
   ```

   Then update the `.env` file with your actual values:

   **API Configuration:**
   - `VITE_REPLIERS_API_KEY` - Your Repliers API key. Get yours at <https://login.repliers.com/>

   **Mapbox Configuration:**
   - `VITE_MAPBOX_KEY` - Your Mapbox API key for location and mapping features. Get yours for free at [mapbox.com](https://www.mapbox.com/).

4. **Run the development server**

   ```bash
   npm run dev
   ```

Happy Coding!
