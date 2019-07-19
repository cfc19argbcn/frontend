var httpModule = (function() {
  var callToRestAPI = function(uri, formValues, callback) {
    headers = {
      'Content-Type': 'application/json'
    }
    if ( localStorage.getItem('token') ){
      headers['X-Access-Token'] = localStorage.getItem('token')
    }
    return fetch(uri, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: headers
    })
    .then(function(res) {
      response = res.json();
      return response;
    })
    .catch(function(err) {
      callback(err)
      console.log("Oops!, something went wrong")
    })
    .then(function(response) {
      console.log("Response: ", response);
      callback(response)
      return response;
    });
  }
  return {
    callToRestAPI
  };
})();
