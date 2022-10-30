# SAP FSM Weather Service Extension

Weather Service extension is a front-end extension used to display the weather according to the start date and time of the selected activity, which is fetched from the data API using the authentication mechanism. It is designed to run within the dispatching board.

### Default Case

When no activity is selected, the weather of the current date is displayed. A warning of the same is displayed in the footer.

## Services Used

SAP FSM Shell SDK <br/>
Data Model Activity DTO v42 <br/>
Weather API <br/>
Tailwind CSS

## Roadblock

CORS error came while trying to access Weather API on SAP FSM. So to bypass the CORS Policy, CORS Anywhere was used. It is a NodeJS reverse proxy which adds CORS headers to the proxied request.