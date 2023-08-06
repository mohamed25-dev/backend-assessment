Make sure you have Docker installed on your system.

Create a ```.env``` file with your configuration details.

Run the following command to start the app using Docker Compose:

```docker-compose up```

### Available APIs

#### Download Stations Data API:

```POST /api/v1/indego-data-fetch-and-store-it-db```

Description: Downloads station data from Indego servers and saves it to the database.

#### Download Weather Data API:

```POST /api/v1/weather-data-fetch-and-store-it-db```

Description: Downloads weather data from Open API servers and saves it to the database.

#### Retrieve Stations Data API:

```GET /api/v1/stations/3005?at=2014-09-01T10:00:00```

Description: Retrieves station data based on the given date.

#### Retrieve Station Data API:

```GET /api/v1/stations/:id/3005?at=2014-09-01T10:00:00```

Description: Retrieves data for the given station ID based on the given date.
