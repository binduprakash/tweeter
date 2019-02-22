function renderTweets(tweets) {
  tweets.forEach(function(tweet){ // loops through tweets
    var $tweet = createTweetElement(tweet); // calls createTweetElement for each tweet
    $('#tweets-container').append($tweet); // takes return value and appends it to the tweets container
  });
}

function loadTweets() {
  $.ajax("/tweets", {method: 'GET'})
    .then(function(tweetsJson) {
      renderTweets(tweetsJson);
    }
  );
}

function createTweetElement(tweet) {
  var $tweet = $("<article>").addClass("tweet");
  var $tweetHeader = $("<header>").addClass("tweet-header");
  var $avatar = $("<div>").addClass("tweet-avatar");
  var $image = $("<img>");
  $image.attr("src", tweet.user.avatars.small);
  $image.attr("alt", "avatar");
  $avatar.append($image);

  var $tweetHeaderName = $("<div>").addClass("tweet-header-name");
  $tweetHeaderName.text(tweet.user.name);
  var $tweetHandler = $("<div>").addClass("tweet-handler");
  $tweetHandler.text(tweet.user.handle);

  $tweetHeader
    .append($avatar)
    .append($tweetHeaderName)
    .append($tweetHandler);

  var $tweetBody = $("<section>").addClass("tweet-body");
  $tweetBody.text(tweet.content.text);
  var $tweetFooter = $("<footer>").addClass("tweet-footer");
  var $tweetCreation = $("<div>").addClass("tweet-creation");
  $tweetCreation.text(tweet.created_at);

  var $tweetIcons = $("<div>").addClass("tweet-icons");

  var $flagIcon = $("<i>");
  $flagIcon
    .addClass("fas")
    .addClass("fa-flag");

  var $retweetIcon = $("<i>");
  $retweetIcon
    .addClass("fas")
    .addClass("fa-retweet");

  var $heartIcon = $("<i>");
  $heartIcon
    .addClass("fas")
    .addClass("fa-heart");

  $tweetIcons
    .append($flagIcon)
    .append($retweetIcon)
    .append($heartIcon);

  $tweetFooter
    .append($tweetCreation)
    .append($tweetIcons);

  $tweet
    .append($tweetHeader)
    .append($tweetBody)
    .append($tweetFooter);

  return $tweet;
}

let showCompose = true;
$(document).ready(function() {
  $(".compose-button").on("click", function(event) {
    let $newTweetContainer = $(".new-tweet");
    $newTweetContainer.css("display", "block");
    console.log($newTweetContainer);
    if(showCompose) {
      $newTweetContainer.slideDown();
      $("#textbox").focus();
    } else {
      $newTweetContainer.slideUp();
    }
    showCompose = !showCompose;

  });
  $("form").on("submit", function(event) {
    event.preventDefault();
    let tweetString = this.text.value.trim();
    console.log(tweetString);
    if(!tweetString){
      $(".error-message").text("Tweet cannot be empty");
      $(".error-message").slideDown();
      return;
    }
    if(tweetString.length > 140){
      $(".error-message").text("Tweet must be within 140 characters");
      $(".error-message").slideDown();
      return;
    }
    $(".error-message").slideUp();
     $.ajax("/tweets", {
      method: 'POST',
      data: $(this).serialize()
    })
      .then(function (response) {
        $("#tweets-container").empty();
        loadTweets();
      });
  });
  loadTweets();
});

