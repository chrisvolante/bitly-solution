# Bitly Solution

## Background

A server to expose an endpoint to provide the average number of clicks Bitlinks in the user's default group received from each country over the last 30 days. 

An API service that exposes this data as JSON over HTTP.

## Prerequisites 

Download and install
[Node](https://www.nodejs.org).

## Getting Started

Follow the commands below in your terminal to start the server.

```bash
cd solution
npm install
npm start
```

## Documentation

### Design Decisions

To improve readability of code, I used 
* [ES7 async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) along with 3rd party library [Axios](https://www.npmjs.com/package/axios) to handle HTTP requests
* Applied Separation of Concerns Principles to functions and file structure

### Dependencies

* Express 4.16.4 - HTTP server
* Axios 0.18.0 - HTTP client

## API

`/v1/metrics/countries` - GET

### Header Parameters

`Authorization: Bearer {token}`

### Response Status Codes

* 500 Internal Error
* 400 Client Error
* 200 Success

### Samples Response

```json
{
    "metrics": [
        {
            "country": "US",
            "average_clicks": 0.7894736842105263
        },
        {
            "country": "PH",
            "average_clicks": 0.21052631578947367
        }
    ],
    "groupId": "{String}"
}
```

### Samples Request

#### curl

```bash
curl -H "authorization:Bearer {token}" localhost:8080/v1/metrics/countries
```