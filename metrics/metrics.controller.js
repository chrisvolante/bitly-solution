const axios = require('axios');

const { BITLY_API_URL } = require('../config');

// retrieves default_group_id from user's access token
const getGroupId = async (accessToken) => {
  const response = await axios.get(BITLY_API_URL + '/user', {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.default_group_guid;
};

// retrieves total clicks for each bitlink
const getTotalClicks = async (id, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/bitlinks/${id}/clicks/summary?unit=day&units=30`, {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.total_clicks;
};

// retrieves number of clicks per country
const getClicksByCountry = async (id, countryClickCount, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/bitlinks/${id}/countries?unit=day&units=30`, {
    headers: {
      Authorization: accessToken
    }
  });
  const countryClicksByBitlink = response.data.metrics;
  // iterates over array of bitlinks to accumulate total clicks per country
  for (let i = 0; i < countryClicksByBitlink.length; i++) {
    let country = response.data.metrics[i];
    if (!countryClickCount[country.value]) {
      countryClickCount[country.value] = 0;
    }
    countryClickCount[country.value] += country.clicks;
  }
  return countryClickCount;
}

// retrieves default_user_group's bitlinks
const getGroupBitlinks = async (id, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/groups/${id}/bitlinks`, {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.links;
};

// formats JSON response into an object that includes metrics as an 
// array of objects and includes the user's groupid
const formatMetrics = (metrics, groupId) => {
  return {
    metrics,
    groupId
  }
}

// calculates the average number of clicks Bitlinks in the user's 
// default group received from each country over the last 30 days
exports.getClickAverages = async (req, res) => {
  let totalClickCount = 0;
  let metrics = [];
  let countryClickCount = {};

  const accessToken = req.headers.authorization;

  const groupId = await getGroupId(accessToken);
  const groupBitlinks = await getGroupBitlinks(groupId, accessToken);

  // accumulates total number of clicks across bitlinks and retrieves
  // the total number of clicks per country
  for (let i = 0; i < groupBitlinks.length; i++) {
    let bitlink = groupBitlinks[i];
    countryClickCount = await getClicksByCountry(bitlink.id, countryClickCount, accessToken);
    totalClickCount += await getTotalClicks(bitlink.id, accessToken);
  }

  // creates new array of click averages per country
  for (let key in countryClickCount) {
    metrics.push({
      "country": key,
      "average_clicks": countryClickCount[key] / totalClickCount
    });
  }

  // JSON response
  return res.status(200).json(formatMetrics(metrics, groupId));
}