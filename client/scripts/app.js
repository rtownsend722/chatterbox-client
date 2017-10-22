var app = {};

app.URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  $('#send').find('.submit').on('click', (event) => { 
    this.handleSubmit(); 
  });
  
  let arrowFunction = (data) => { this.postMessages(data); };

  this.fetch(arrowFunction);

  setInterval(function() { app.fetch(arrowFunction); }, 5000);
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

app.fetch = function(cb, data) {
  $.ajax({
    url: this.URL,
    type: 'GET',
    data: {limit: 10000},
    success: function (data) {
      cb(data.results);
    },
    error: function() { console.log('error'); }
  });

};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  var $message = $(`<div class="chat"></div>`);
  
  var $username = $(`<a href="#" class="username"></a>`);
  var $text = $(`<span class="text"></span>`);
  var $roomname = $(`<span class="roomname"></span>`);

  $username.text(message.username);
  $text.text(message.text);
  $roomname.text(message.roomname);

  $username.on('click', (event) => {
    this.handleUsernameClick(event);
  });

  $message.append($username);
  $message.append($text);
  $message.append($roomname);
  
  $('#chats').prepend($message);
};

app.renderMessages = function() {
  for (let i = 0; i < this.feed.length; i++) {
    this.renderMessage(this.feed[i]);
  }
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div>`${room}`</div>');
};

app.handleUsernameClick = function(event) {
  var friend = event.toElement.innerHTML;
  if (this.friendlist.indexOf(friend) < 0) {
    this.friendlist.push(friend);  
  }
  
  app.friend = friend;

  $('#friendlist').html('');
  for (let i = 0; i < this.friendlist.length; i++) {
    const thisFriend = $(`<button class="${this.friendlist[i]}">${this.friendlist[i]}</button>`);
    // event handler
    thisFriend.on('click', (event) => {
      this.filterMessages(event);
    });

    $('#friendlist').append(thisFriend);
  }
  
};

app.filterMessages = function(event) {
  $('#chats').html('');
  for (let i = 0; i < this.feed.length; i++) {
    if (this.feed[i].username === app.friend) {
      this.renderMessage(this.feed[i]);
    }
  }
};

app.handleSubmit = function() {
  var content = $('#send').find('#message').val();
  let data = {username: $('#username').val(), text: content, roomname: $('#roomname').val()};
  this.send(data);
  this.renderMessage(data);
};

app.postMessages = function(data) {
  
  this.feed = data;

  for (let i = 0; i < data.length; i++) {
    const thisMessage = data[i];
    const roomName = thisMessage.roomname;
    if (!thisMessage.username || !thisMessage.text || thisMessage.username < 1 || thisMessage.text.length < 1) {
      continue;
    } 

    if (this.availableRooms.indexOf(roomName) < 0) {
      this.availableRooms.push(roomName);
    }
    if (!this.showAll) {
      if (roomName === this.room) {
        this.renderMessage(thisMessage);
      } else {
        continue;
      }
    } else {
      this.renderMessage(thisMessage);
    }
  }
  
  $('#roomlist').html('');  
  
  for (let i = 0; i < this.availableRooms.length; i++) {
    if (this.availableRooms[i] && this.availableRooms[i].length < 1) {
      continue;
    }
    $room = $(`<div><button class="${this.availableRooms[i]} roombutton">${this.availableRooms[i]}</button></div>`);
    $($room).on('click', (event) => { this.handleRoomNameClick(event); });
    $('#roomlist').append($room);
  }
  
};

app.handleRoomNameClick = function(event) {
  const selectedRoom = event.toElement.innerHTML;

  $('#chats').html('');

  if (selectedRoom === 'All Rooms') {
    this.showAll = true;
    this.renderMessages();
    return;
  }
  $('#roomname').val(selectedRoom);

  this.showAll = false;
  this.room = selectedRoom;
  this.postMessages(this.feed);
};

app.room = 'awesome room';
app.showAll = true;
app.availableRooms = ['All Rooms'];
app.feed = [];
app.friendlist = [];

$(document).ready(function() {
  app.init();
});






