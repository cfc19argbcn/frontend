var sensorsModule = (
  function() {
    /**
     * @param {string} id
     * @returns {HTMLInputElement}
     */
    var getInput = function(id) {
      return document.getElementById(id);
    }

    var getFormValues = function () {
      return {
        id: getInput("sensor-id").value,
        name: getInput("sensor-name").value
      };
    }

    /**
     * @param {Event} event
     */
    var register = function(event) {
      event.preventDefault();
      var formValues = getFormValues();
      httpModule.callToRestAPI("/api/sensor", formValues);
    };

    return {
      register
    };
  }
)();