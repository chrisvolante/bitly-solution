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

`/v1/metrics/countries` - GET

Path Parameters

bitlink
required
string
A Bitlink made of the domain and hash

Query Parameters

unit
required
string
Default: "day"
Enum:"minute" "hour" "day" "week" "month"
A unit of time

units
required
integer
Default: -1
An integer representing the time units to query data for. pass -1 to return all units of time.

Responses

500
400
200

Samples
Response

Write a postman collection
Write a curl command