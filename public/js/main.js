'use strict';

$(document).ready(init);

////// Variables

var token;

////// Initialization

function init() {
  $('div#container').on('click', 'button#register-login', showLogin);
  $('div#container').on('click', 'button#login-register', showRegistration);
  $('div#container').on('click', 'button#profile-cancel', showHomepage);
  $('div#container').on('click', 'button#item-cancel', showHomepage);

  $('div#container').on('click', '#home-profile', showProfile);
  $('div#container').on('click', '#home-logout', showLogin);
  $('div#container').on('click', '#home-list', addItem);
  $('div#container').on('click', '.home-edit', editItem);
  $('div#container').on('click', '.home-view', viewItem);

  $('div#container').on('submit', 'form#login', doLogin);
  $('div#container').on('submit', 'form#register', doRegister);
  $('div#container').on('submit', 'form#profile', saveProfile);
  $('div#container').on('submit', 'form.item-edit', saveItem);
  $('div#container').on('submit', 'form#item-new', newItem);
  $('div#container').on('submit', 'form.item-offer', offerItem);

  initUser();
}

function getPage(url, cb) {
  $.ajax({
    method: 'GET',
    url: url,
    headers: {'X-Authenticate': token},
    success: function(data) {
        $('div#container').children().remove();
        cb(data);
      },
    error: function() {
        $('h4.error').text('We met an unexpected error. Don\'t worry, you\'ll be fine');
        $('div#show-error').modal();
      }
  });
}

function initUser() {
  token = localStorage.token;

  $.ajax({
    method: 'GET',
    url: '/api/user/me',
    headers: {'X-Authenticate': token},
    success: showHomepage,
    error: showLogin
  });
}

function showLogin() {
  localStorage.token = token = undefined;
  getPage('/login', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showHomepage() {
  getPage('/homepage', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showRegistration() {
  getPage('/register', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showProfile() {
  getPage('/profile', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function addItem(event) {
  getPage('/item-edit', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function editItem(event) {
  getPage('/item-edit/' + event.target.id.substring(3), function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function viewItem(event) {
  getPage('/item-review/' + event.target.id.substring(3), function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showError() {
  $('h4.error').text('We met an unexpected error. Don\'t worry, you\'ll be fine.');
  $('div#show-error').modal();
}

////// Homepage


////// New User

function doRegister(event) {
  event.preventDefault();

  if ($('input#password').val() !== $('input#_password').val()) {
    $('h4.error').text('Passwords do not match.');
    $('div#show-error').modal();
    return;
  }

  var user = {};
  user.password = $('input#password').val();
  user.username = $('input#username').val();

  $.ajax({
    method: 'POST',
    url: '/api/user/register',
    data: user,
    success: showLogin,
    error: showError
  });
}


////// Login

function doLogin(event) {
  event.preventDefault();

  var user = {};
  user.password = $('input#password').val();
  user.username = $('input#username').val();

  $.ajax({
    method: 'POST',
    url: '/api/user/authenticate',
    data: user,
    success: function(data, textStatus, request) {
      token = request.getResponseHeader('X-Authenticate')
      localStorage.setItem('token', token);
      showHomepage();
    },
    error: showError
  });
}

////// Profile

function saveProfile() {
  event.preventDefault();

  if ($('input#password').val() !== $('input#_password').val()) {
    $('h4.error').text('Passwords do not match.');
    $('div#show-error').modal();
    return;
  }

  var user = {};
  $('form#profile input.ud').each(function() {
    user[$(this).attr('id')] = $(this).val();
  });

  $.ajax({
    method: 'PUT',
    url: '/api/user/me',
    headers: {'X-Authenticate': token},
    data: user,
    success: function() {
      $('h4.error').text('Profile has been saved.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function saveItem(event) {
  event.preventDefault();

  var item = {};
  $('form.item-edit input.ud').each(function() {
    item[$(this).attr('id')] = $(this).val();
  });
  item.forSale = $('input#forSale').prop('checked');
  item._id = event.target.id.substring(3);

  $.ajax({
    method: 'PUT',
    url: '/api/user/item',
    headers: {'X-Authenticate': token},
    data: item,
    success: function() {
      $('h4.error').text('The item has been saved.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function newItem(event) {
  event.preventDefault();

  var item = {};
  $('form#item-new input.ud').each(function() {
    item[$(this).attr('id')] = $(this).val();
  });
  item.forSale = $('input#forSale').prop('checked');

  $.ajax({
    method: 'POST',
    url: '/api/user/item',
    headers: {'X-Authenticate': token},
    data: item,
    success: function() {
      $('h4.error').text('The item has been added.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function offerItem(event) {
  event.preventDefault();

  var offer = {};
  offer.to = '';
  offer.for = event.target.id.substring(3);
  offer.offer = '';
  offer.comment = $('input#comment').val();
return;
  $.ajax({
    method: 'POST',
    url: '/api/user/offer',
    headers: {'X-Authenticate': token},
    data: offer,
    success: function() {
      $('h4.error').text('Your offer has been sent.');
      $('div#show-error').modal();
    },
    error: showError
  });
}
