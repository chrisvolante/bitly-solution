# Bitly Solution

## Background

A server to expose an endpoint to provide the average number of clicks Bitlinks in the user's default group received from each country over the last 30 days. In other words, you will want to divide the number of clicks from each country by the total number of Bitlinks clicked over the last 30 days.
Construct an API service that exposes this data as JSON over HTTP.

## Prerequisites 

Download and install the links below
[Node](nodejs.org)

## Getting Started

Follow the commands below to start the server

```bash
git clone https://github.com/chrisvolante/solution.git
cd solution
npm install
npm start
```

## Documentation

### Design Decisions

### Dependencies

* Express 4.16.3
* Axios 0.18.0

## API

`/v1/metrics/countries` - GET

### Header Parameters

`Authorization: Bearer {token}`

### Responses

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
    "groupId": "Bj42iEvOLyZ"
}
```

### Samples Request

#### curl

```bash
curl -H "authorization:Bearer {token}" localhost:8080/v1/metrics/countries
```
