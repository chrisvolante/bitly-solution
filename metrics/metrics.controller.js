const axios = require('axios');

const { ACCESS_TOKEN, BITLY_API_URL } = require('../config');

let totalClickCount = 0;
let metrics = [];
let countryClickCount = {};

const getGroupId = async () => {
  try {
    const response = await axios.get(BITLY_API_URL + '/user', {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    });
    return response.data.default_group_guid;
  } catch (error) {
    console.log(error);
  }
};

// pass group id
const getTotalClicks = async (id) => {
  try {
    const response = await axios.get(`https://api-ssl.bitly.com/v4/bitlinks/${id}/clicks/summary`, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    });
    // return this
    totalClickCount += response.data.total_clicks;
  } catch (error) {
    console.log(error);
  }
};

const getClicksByCountry = async (id) => {
  try {
    const response = await axios.get(`https://api-ssl.bitly.com/v4/bitlinks/${id}/countries`, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    });
    //format response always return
    for (let i = 0; i < response.data.metrics.length; i++) {
      let country = response.data.metrics[i];
      if (!countryClickCount[country.value]) {
        countryClickCount[country.value] = 0;
      }
      countryClickCount[country.value] += country.clicks;
    }
  } catch (error) {
    console.log(error);
  }
};

const getGroupBitlinks = async (id) => {
  try {
    const response = await axios.get(`https://api-ssl.bitly.com/v4/groups/${id}/bitlinks`, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    });
    const bitlinksArray = response.data.links;

    for (let i = 0; i < bitlinksArray.length; i++) {
      let element = bitlinksArray[i];
      await getClicksByCountry(element.id);
    }
    for (let i = 0; i < bitlinksArray.length; i++) {
      let element = bitlinksArray[i];
      await getTotalClicks(element.id);
    }
    for (let key in countryClickCount) {
      metrics.push({
        "country": key,
        "average_clicks": countryClickCount[key] / totalClickCount
      });
    }
    console.log(metrics);
  } catch (error) {
    console.log(error);
  }
};

// getGroupBitlinks();

exports.getClickAverages = async (req, res) => {
  const groupId = await getGroupId();
  const groupBitlinks = await getGroupBitlinks(groupId);


}