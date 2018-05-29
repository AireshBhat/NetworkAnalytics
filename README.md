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

### TODO:
1. Shell script to automatically set up the environment and install necessary packages
2. Add a UI part in the README
