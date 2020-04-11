import fetch from 'isomorphic-fetch';

import CONFIG from 'config'
const API_URI = CONFIG.API_URI;

const Api = {
  fetchBudgetSummary: function(token, from_date, to_date) {
    const options = {
      headers: {}
    };
    options.headers.Authorization = "JWT " + token;
    return fetch(API_URI + '/api/categories/summary/' + from_date.replace(/-/g, "") + '/' + to_date.replace(/-/g, ""), options).then(resp => resp.json())
  }
};

export default Api;