# NetworkAnalytics

## Project Statement:

Create graph-based analytics on the fly based on the csv/xlsx uploaded.

## Git rules:
1. Create a separate branch based on the API endpoints 
2. Create issues based on the API
3. Test the API through Postman

## API:
```
1. Create a REST client for a temporary basis to test the UI
2. Shift to GraphQL if need be based on progress
```

#### Endpoints:

| Endpoints | Brief           |
| ------|:-------------:|
| '/'                           | Home/Dashboard. Contains paths to other links and gives a generic outline, if any |
| '/uploadData/'                | Upload the xlsx, csv here and wait for confirmation, reroute to dashboard |
| '/individualAnalytics/'       | Options to query a particular device in multiple ways to generate and download those graphs | 
| '/comparativeAnalytics/'      | Add options to compare similar parameters and tabulate them |

### UI Specs:

#### Splash screen
Lift an LVPEI logo and add some animation.

#### Dashboard
1. Navigation drawer with other endpoints
2. Available devices on the server
3. A link to last uploaded device

#### Upload Data
1. A field to upload files/ drag and drop the file. Add checks for the file name
2. If confirmation received, reroute to '/individualAnalytics/' for that uploaded data

#### Individual Analytics 
1. Show a list of available devices 
2. Upon selection, display an initial graphs and give graph options, and if any, download options in a split screen type i.e only half screen will be used for the display. The other half will have other general info and input parameters. 

#### Comparative Analytics 
1. Show a list of available devices
2. Generate tabular data based on available parameters(mostly hardcoded params).

#### Timetable:

##### UI:

##### Backend:
1. Filling db through xlsx/csv uploaded
2. REST endpoints for dashboard
3. List and number of available devices
4. Give Device based data
5. Specific analytics computation

### TODO:
1. Shell script to automatically set up the environment and install necessary packages
