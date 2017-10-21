// YOUR CODE HERE:

var app = {};

app.URL = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  $('#main').find('.username').on('click', this.handleUsernameClick);
  $('#send').find('.submit').on('click', (event) => { 
    this.handleSubmit(); 
  });
  
  let arrowFunction = (data) => { this.postMessages(data); };

  this.fetch(arrowFunction);


  console.log('App.init has called!');
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
    data: {limit: 9999999},
    success: function (data) {
      cb(data);
      this.feed = data.results;
      console.log(this.feed);
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

app.renderMessages = function() {
  for (let i = 0; i < this.feed.length; i++) {
    this.renderMessage(this.feed[i]);
  }
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div>`${room}`</div>');
};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {
  var content = $('#send').find('#message').val();
  let data = {username: 'DanAndRebecca', text: content, roomname: 'awesome room'};
  this.send(data);
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

  // populate the aside
  for (let i = 0; i < this.availableRooms.length; i++) {

    // if the (safe) room name has no length, then skip it
    if (this.availableRooms[i] && this.availableRooms[i].length < 1) {
      continue;
    }

    // make a new roomName node
    $room = $(`<div><button class="${this.availableRooms[i]} roombutton">${this.availableRooms[i]}</button></div>`);

    $($room).on('click', (event) => { this.handleRoomNameClick(event); });

    // append the node to the aside
    $('#roomlist').append($room);
  }


};

app.handleRoomNameClick = function(event) {
  //identify room name by roomname.text()
  const selectedRoom = event.toElement.innerHTML;

  console.log('handleRoomNameClick invoked', selectedRoom);

  if (selectedRoom === 'All Rooms') {
    this.showAll = true;
    console.log('showing all rooms...');
    this.renderMessages();
    return;
  }

  // set up the filter
  this.showAll = false;
  this.room = selectedRoom;

  console.log(this.showAll, this.room);

  // re-render the messages
  this.renderMessages();

};

app.room = 'awesome room';
app.showAll = true;
app.availableRooms = ['All Rooms'];
app.feed = [];

$(document).ready(function() {
  app.init();
});




