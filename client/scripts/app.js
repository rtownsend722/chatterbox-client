// YOUR CODE HERE:

var app = {};

app.URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  $('#main').find('.username').on('click', this.handleUsernameClick);
  $('#send').find('.submit').unbind('submit').bind('submit', () => { this.handleSubmit(); } );
};

app.send = function(message) { 
  $.ajax({
    url: this.URL,
    type: 'POST',
    data: JSON.stringify(message),
  }); 
};

app.fetch = function() {
  $.ajax({
    url: this.URL,
    type: 'GET',
    crossDomain: true,
    success: function(data) {console.log("data", data); console.log('success!');},
    error: function() {console.log('error');}
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  $('#chats').append(`<div class="chat"><span class="username">${message.username}</span><span>${message.text}</span></div>`);

};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div>`${room}`</div>');
};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {
  let data = $('#send').find('#message');

  this.send(data);
};

app.fetch();





