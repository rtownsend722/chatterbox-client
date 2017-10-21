// YOUR CODE HERE:

var app = {};

app.URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  $('#main').find('.username').on('click', this.handleUsernameClick);
  $('#send').find('.submit').on('click', (event) => { 
    this.handleSubmit(); 
  });
  $('.roombutton').on('click', (event) => { this.handleRoomNameClick(event); });

  let arrowFunction = (data) => { this.postMessages(data); };

  this.fetch(arrowFunction);
};

app.send = function(message) { 
  $.ajax({
    url: this.URL,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function() { console.log(message); },
    error: function() { console.log('Error.'); }
  }); 
};



app.fetch = function(cb) {
  $.ajax({
    url: this.URL,
    type: 'GET',
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
  var $message = $(`<div class="chat"></div>`);
  
  var $username = $(`<span class="username"></span>`);
  var $text = $(`<span class="text"></span>`);
  var $roomname = $(`<span class="roomname"></span>`);

  $username.text(message.username);
  $text.text(message.text);
  $roomname.text(message.roomname);

  $message.append($username);
  $message.append($text);
  $message.append($roomname);

  $('#chats').prepend($message);
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div>`${room}`</div>');
};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {

  console.log('TEST');

  var content = $('#send').find('#message').val();

  let data = {username: 'DanAndRebecca', text: content, roomname: 'awesome room'};

  this.send(data);

  // also update our own component
  // get data from form

  this.renderMessage(data);
};

app.postMessages = function(data) {
  data = data.results;

  for (let i = 0; i < data.length; i++) {
    const thisMessage = data[i];
    if (!thisMessage.username || !thisMessage.text || thisMessage.username < 1 || thisMessage.text.length < 1) {
      continue;
    } 

    const roomName = thisMessage.roomname;

    if (this.availableRooms.indexOf(roomName) < 0) {
      this.availableRooms.push(roomName);
    }

    // if (roomName === this.room) {
    if (true) {
      this.renderMessage(thisMessage);
    } {
      continue;
    }

  }

  // populate the aside
  for (let i = 0; i < this.availableRooms.length; i++) {

    if (this.availableRooms[i].length < 1) {
      continue;
    }

    // make a new roomName node
    $room = $(`<div><button class="${this.availableRooms[i]} roombutton">${this.availableRooms[i]}</button></div>`);
    // append the node to the aside
    $('#roomlist').append($room);
  }

};

app.handleRoomNameClick = function(event) {
  console.log("asdf");

  //identify room name by roomname.text()
  console.log(event);

};

app.room = 'awesome room';
app.availableRooms = ['All Rooms'];

$(document).ready(function() {
  app.init();
});




