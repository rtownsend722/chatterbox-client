// YOUR CODE HERE:

var app = {};

app.URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  $('#main').find('.username').on('click', this.handleUsernameClick);
  // $('#send').find('.submit').unbind('submit').bind('submit', () => { this.handleSubmit(); } );
  $('#send').find('.submit').on('click', (event) => { 
    this.handleSubmit(); 
    // event.preventDefault();
  });

  this.fetch(this.postMessages);
};

app.send = function(message) { 
  $.ajax({
    url: this.URL,
    type: 'POST',
    data: JSON.stringify(message),
  }); 
};

app.fetch = function(cb) {
  $.ajax({
    url: this.URL,
    type: 'GET',
    crossDomain: true,
    success: function (data) {
      cb(data);
    },
    error: function() { console.log('error'); }
  });

};


app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  $('#chats').append(`<div class="chat"><span class="username">${message.username}</span><span>${message.text}</span><span class="roomname">${message.roomname}</span></div>`);

};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div>`${room}`</div>');
};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {

  console.log('TEST');

  let data = $('#send').find('#message').val();

  this.send(data);

  // also update our own component
  // get data from form
  const message = $('#message').val();
  console.log(message);
  this.renderMessage({username: 'self', message: message, roomname: 'somethingdistinctive'});
};

app.escapeMessage = function(obj) {
  let {text, username, roomname} = obj;

  text = escape(text);
  username = escape(username);
  roomname = escape(roomname);

  return {text, username, roomname};
};

app.postMessages = function(data) {
  data = data.results;

  for (let i = 0; i < data.length; i++) {
    const thisMessage = data[i];
    const safeMessage = app.escapeMessage(thisMessage);
    app.renderMessage(safeMessage);
  }

};

$(document).ready(function() {
  app.init();
});




