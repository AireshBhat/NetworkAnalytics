# NetworkAnalytics

## Project Statement:

Create graph-based analytics on the fly based on the csv/xlsx uploaded.

## Git rules:
1. Create a separate branch based on the API endpoints 
2. Create issues based on the API
3. Test the API through Postman

## API:
```
1. Create a REST API and UI
2. Shift to GraphQL if need be based on progress
```

#### Endpoints:

| Endpoints | Brief           | GET | POST | 
| ------|:-------------:| :------------: | :-----------: |
| '/'                           | Home/Dashboard. Contains paths to other links and gives a generic outline, if any | dashboard.html | body: null; response: {"number_of_devices":, "last_upload_time": } |
| '/uploadData/'                | Upload the xlsx, csv here and wait for confirmation, reroute to dashboard | returns upload_data.html | body:{"uploaded_file":device_region_isp.csv}; response:{"status":"OK"}|
| '/individualAnalytics/'       | Options to query a particular device in multiple ways to generate and download those graphs | individual_analytics.html | body:{"device_name": } ; response:{Parameters List} |
| '/comparativeAnalytics/'      | Add options to compare similar parameters and tabulate them | 'comparative_analytics.html' | body:{"devices":[list of devices]} ; response:{Parameters}  |
| 'deviceStats/'| returns important parameters related to the device | body:{"device_name":, "start_date":, "end_date":, } | response:{"average_ping":, "average_up_time":, "average_down_time":,"average_rta":} |
|'/devices/'| list of devices on server | returns device list| None|
| '/isAllowed' | returns whether the user has delete permission | "isAllowed": true or false | None |
| '/logout/' | logs out the user and returns to login | returns to login page | None |

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
