/*
  Function to insert tweet article into tweets-container to
  show all the tweets for the user.
*/
function renderTweets(tweets) {
  tweets.forEach(function(tweet){
    var $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet); // takes return value and appends it to the tweets container
  });
}

/*
  Function to make an AJAX GET to /tweets and get all the tweets in
  JSON format and call renderTweets to add them to HTML DOM
*/
function loadTweets() {
  $.ajax("/tweets", {method: 'GET'})
    .then(function(tweetsJson) {
      renderTweets(tweetsJson);
    }
  );
}

/*
  Function to format the tweet created at timestamp to user readable
  format.
*/
function getFormattedTime(createdAtUnixTimeStamp){
  let createdAt = new Date(createdAtUnixTimeStamp);
  let today = new Date();
  let timeDiffInSeconds = (today.getTime() - createdAt.getTime()) / 1000;
  if (timeDiffInSeconds < 1){
    return 'Just now';
  } else if (timeDiffInSeconds < 60) {
    return Math.round(timeDiffInSeconds) + ' sec ago';
  } else if ((timeDiffInSeconds / 60) < 60){
    return Math.round(timeDiffInSeconds / 60) + ' mins ago';
  } else if (((timeDiffInSeconds / 60)/60) < 24){
    return Math.round((timeDiffInSeconds / 60)/60) + ' hrs ago';
  } else if ((((timeDiffInSeconds / 60)/60)/24) < 27){
    return Math.round(((timeDiffInSeconds / 60)/60)/24) + ' days ago';
  } else {
    return createdAt.toLocaleString();
  }
}

function createTweetElement(tweet) {

  var $tweet = $("<article>").addClass("tweet");
  var $tweetHeader = $("<header>").addClass("tweet-header");
  var $avatar = $("<div>").addClass("tweet-avatar");

  // Adding avatar
  var $image = $("<img>");
  $image.attr("src", tweet.user.avatars.small);
  $image.attr("alt", "avatar");
  $avatar.append($image);

  // Adding name
  var $tweetHeaderName = $("<div>").addClass("tweet-header-name");
  $tweetHeaderName.text(tweet.user.name);
  var $tweetHandler = $("<div>").addClass("tweet-handler");
  $tweetHandler.text(tweet.user.handle);

  // Constructing header
  $tweetHeader
    .append($avatar)
    .append($tweetHeaderName)
    .append($tweetHandler);

  var $tweetBody = $("<div>").addClass("tweet-body");
  $tweetBody.text(tweet.content.text);
  var $tweetFooter = $("<footer>").addClass("tweet-footer");
  var $tweetCreation = $("<div>").addClass("tweet-creation");
  $tweetCreation.text(getFormattedTime(tweet.created_at));

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

  // Constructing footer
  $tweetFooter
    .append($tweetCreation)
    .append($tweetIcons);

  // Constructing full tweet
  $tweet
    .append($tweetHeader)
    .append($tweetBody)
    .append($tweetFooter);

  return $tweet;
}

// flag to show or hide new tweet container
let showCompose = true;

$(document).ready(function() {
  /*
    Click event handler for compose button to show or hide new tweet container
  */
  $(".compose-button").on("click", function(event) {
    let $newTweetContainer = $(".new-tweet");
    console.log($newTweetContainer);
    if(showCompose) {
      $newTweetContainer.slideDown();
      $("#textbox").focus();
    } else {
      $newTweetContainer.slideUp();
    }
    showCompose = !showCompose;

  });

  /*
    Form submit event handler which prevents default and send AJAX POST to server
    with new tweet details. On success, all tweets will be re-loaded.
    Also does validations to make sure valid tweets are sent to server else displays
    error back to user.
  */
  $("form").on("submit", function(event) {

    // Prevents defaults
    event.preventDefault();

    // Remove white spaces at beginning and end.
    let tweetString = this.text.value.trim();

    // Show error if tweet is empty
    if(!tweetString){
      $(".error-message").text("Tweet cannot be empty");
      $(".error-message").slideDown();
      return;
    }

    // Show error if tweet is more than 140
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
        $("#textbox").val('');
      });
  });

  // Load all tweets
  loadTweets();
});

