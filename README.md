Make sure you have Docker installed on your system.

Create a ```.env``` file with your configuration details.

```
DB_USER=root
DB_PASSWORD=secret
DB_NAME=bikes_data

DATABASE_URL="postgresql://root:secret@postgres:5432/bikes_data?sslmode=disable"
BIKES_API="https://bts-status.bicycletransit.workers.dev/phl"
WEATHER_API="http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=87cf756660a8a4db8bc13f47fb8d49ad"
ACCESS_TOKEN=verySecretRandomToken
```

Run the following command to start the app using Docker Compose:

```docker-compose up```

### Available APIs

Please note that all APIs are secured with an ``` ACCESS_TOKEN ``` specified in the environment variable. To access these APIs, you must provide the token in the Authorization header.

#### Download Stations Data API:

```POST /api/v1/indego-data-fetch-and-store-it-db```

Description: Downloads station data from Indego servers and saves it to the database, however, note that there are two scheduled jobs that have been set up to run every hour. 
These jobs fetch data from the Indego and Open Weather APIs, storing it in the database. So the API's are a convinent alternative.

#### Download Weather Data API:

```POST /api/v1/weather-data-fetch-and-store-it-db```

Description: Downloads weather data from Open API servers and saves it to the database.

#### Retrieve Stations Data API:

```GET /api/v1/stations/3005?at=2014-09-01T10:00:00```

Description: Retrieves station data based on the given date.

#### Retrieve Station Data API:

```GET /api/v1/stations/:id?at=2014-09-01T10:00:00```

Description: Retrieves data for the given station ID based on the given date.

#### API documentation:

```GET /api```

Description: a web page that shows API's documentation.

## Notes:
For database design, I've chosen to store the API's retrieved data in a JSON column. 
Since we  query the data and no updates are done on these fields suits well. 
I've added dedicated columns indexed for querying criteria – like station id and dates for bike data. to improve querying efficiency.
