const axios = require('axios');

const { BITLY_API_URL } = require('../config');

const getGroupId = async (accessToken) => {
  const response = await axios.get(BITLY_API_URL + '/user', {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.default_group_guid;
};

const getTotalClicks = async (id, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/bitlinks/${id}/clicks/summary?unit=month&units=1`, {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.total_clicks;
};

const getClicksByCountry = async (id, countryClickCount, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/bitlinks/${id}/countries?unit=month&units=1`, {
    headers: {
      Authorization: accessToken
    }
  });
  const countryClicksByBitlink = response.data.metrics;
  for (let i = 0; i < countryClicksByBitlink.length; i++) {
    let country = response.data.metrics[i];
    if (!countryClickCount[country.value]) {
      countryClickCount[country.value] = 0;
    }
    countryClickCount[country.value] += country.clicks;
  }
  return countryClickCount;
}

const getGroupBitlinks = async (id, accessToken) => {
  const response = await axios.get(BITLY_API_URL + `/groups/${id}/bitlinks`, {
    headers: {
      Authorization: accessToken
    }
  });
  return response.data.links;
};

const formatMetrics = (metrics, groupId) => {
  return {
    metrics,
    groupId
  }
}

exports.getClickAverages = async (req, res) => {
  let totalClickCount = 0;
  let metrics = [];
  let countryClickCount = {};

  const accessToken = req.headers.authorization;

  const groupId = await getGroupId(accessToken);
  const groupBitlinks = await getGroupBitlinks(groupId, accessToken);

  for (let i = 0; i < groupBitlinks.length; i++) {
    let bitlink = groupBitlinks[i];
    countryClickCount = await getClicksByCountry(bitlink.id, countryClickCount, accessToken);
    totalClickCount += await getTotalClicks(bitlink.id, accessToken);
  }

  for (let key in countryClickCount) {
    metrics.push({
      "country": key,
      "average_clicks": countryClickCount[key] / totalClickCount
    });
  }

  return res.status(200).json(formatMetrics(metrics, groupId));
}