// YOUR CODE HERE:

app = {

    server: 'http://127.0.0.1:3000',

    init: function() {
      console.log('running chatterbox');
      // Get username
      app.username = window.location.search.substr(10);

      // cache some dom references
      app.$text = $('#message');

      app.loadAllMessages();

      $('#send').on('submit', app.handleSubmit);
    },

    loadAllMessages: function(){
      app.loadMsgs();
      setTimeout( app.loadAllMessages, 5000 );
    },

    handleSubmit: function(e){
      e.preventDefault();

      var message = {
        username: app.username,
        text: app.$text.val()
      };
      app.$text.val('');

      app.sendMsg(message);
    },

    renderMessage: function(message){
      var $user = $("<div>", {class: 'user'}).text(message.username);
      var $text = $("<div>", {class: 'text'}).text(message.text);
      var $message = $("<div>", {class: 'chat', 'data-id': message.objectId }).append($user, $text);
      return $message;
    },

    addToDom: function(message){
      if( $('#chats').find('.message[data-id='+message.objectId+']').length === 0 ){
        var $html = app.renderMessage(message);
        $('#chats').prepend($html);
      }
    },

    processMessages: function(messages){
      for( var i = messages.length; i > 0; i-- ){
        app.addToDom(messages[i-1]);
      }
    },

    loadMsgs: function(){
      $.ajax({
        url: app.server,
        // data: { order: '-createdAt'},
        contentType: 'application/json',
        success: function(json){
          // console.log(json.results);
          app.processMessages(json.results);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    sendMsg: function(message){
      app.startSpinner();
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(json){
          // console.log(json);
          message.objectId = json.objectId;
          app.addToDom(message);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }
};
