var httpModule = (function() {
  var callToRestAPI = function(uri, formValues) {
    return fetch(uri, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(function(res) {
      return res.json();
    })
    .catch(function(err) {
      console.log("Oops!, something went wrong")
    })
    .then(function(response) {
      console.log("Response: ", response);
      return response;
    });
  }
  return {
    callToRestAPI
  };
})();
