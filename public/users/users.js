var usersModule = (
  function(){
    /**
     * @param {string} id
     * @returns {HTMLInputElement}
     */
    var getInput = function(id) {
      return document.getElementById(id);
    }

    var getRegisterFormValues = function () {
      return {
        email: getInput("email").value,
        name: getInput("name").value,
        password: getInput("password").value
      };
    }

    var getLoginFormValues = function() {
      return {
        email: getInput("email").value,
        password: getInput("password").value
      }
    }

    var equalsPasswords = function() {
      return getInput("password").value === getInput("confirm-password").value;
    }

    /**
     * @param {Event} event
     */
    var register = function(event) {
      event.preventDefault();
      if (equalsPasswords()) {
        var formValues = getRegisterFormValues();
        httpModule.callToRestAPI("/api/user", formValues);
      } else {
        var pswAlert = '<div class="alert alert-danger alert-dismissible fade show" role="alert">'+
          '<strong>Oops!</strong> The password should match.' +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
          '</button>' +
          '</div>';
        $("body").prepend(pswAlert);
      }
    };

    var login = function(event) {
      event.preventDefault();
      var formValues = getLoginFormValues();
      httpModule.callToRestAPI("/api/login", formValues);
    }

    return {
      login,
      register
    };
  }
)();