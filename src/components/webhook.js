if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });


  Api.addRoute('webhook', {
    get: function () {
    if (this.queryParams['hub.mode'] === 'subscribe' &&
      this.queryParams['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        console.log('Validating webhook');
        return {
          statusCode: 200,
          body: parseInt(this.queryParams['hub.challenge'])
        };
      } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        return {
          statusCode: 403,
        };
      }
  }
})


}
