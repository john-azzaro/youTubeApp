"use strict";

// we use caps because it is a "define" so people know its a defintion. it is a global constant.
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';     
const YOUTUBE_API_KEY = 'AIzaSyAuqE0-TIkITIqLiMivkFykEh_bJeg-kDk';              

// search term gets passed. 
// pagetoken is passed in from   
// making the query to send .. the query is used to query the api 
// the information below would be different depending on the information you wanted to get from the api 
// also, this information is specific to the api.  
function getDataFromApi(searchTerm, callback, pageToken) {        
  

// this would be a package trade, where I am submitting 8-13 as an object and then in return api gives me the data.   
  const requestData = {      
// what im looking for  (search term)                                    
    q: `${searchTerm}`, 
// what i want in return    (snippet is the real data about the video)                         
    part: 'snippet',   
// authorization to get it  (this would be minimal to search through youtube)
    key: YOUTUBE_API_KEY,                                   
  }
// if a page token exists, add to the request data a pagetoken.
  if (pageToken) { requestData.pageToken = pageToken; }                             
// this function is to use if it is a success.  this is what come back from the api.
  function success(responseData) {              
// if succesful, then run callback function (apssed in from line 4 second param).  a success can only take one param.  if we need more than one, we need a wrapped function.  takes the search term and the data from the response.  then you go to 
    callback(responseData, searchTerm);         
  }
// here we say get JSON at the URL, with the request data and then when you are done then you run the success function .  it then jumps to line 15 (success)        
  $.getJSON(YOUTUBE_SEARCH_URL, requestData, success);              
}

// render result happened on line 31.  this gets run each time in data.items.
function renderResult(result) {      
 // in each item is result.id.videoId or result.snippet.thuimbnails.medium.url.  result is a javascript object with all the information about the video.  this function takes that information and makes a vidsaul representation on the screen
  return ` 
  <li>
    <a href="https://youtu.be/${result.id.videoId}"> <img src="${result.snippet.thumbnails.medium.url}"> </a>
    <a href="https://youtube.com/channel/${result.snippet.channelId}">More from this channel!</a>
  </li>
  `;
}

// data is whats coming back from response, and searchterm is coming from line 4 param (via line 16).. basically what was origanally coming from the text box passed from funcitont to function. 
function displayYouTubeSearchData(data, searchTerm) { 
  // data.items is responseData.  items is speific to youtube. so you get back an array called items (specific to youtube).  the idea is you just get data back.   so for each item we apply renderResult and then join them back into a string.  renderResult gives you back a string so that when you map with renderResult you get back an array of strings.  then the result html below puts uls around it.                     
  const results = data.items.map((item) => renderResult(item)).join("\n");      
  const resultHTML = `<ul>${results}</ul>`;
// show it on screen inside the js-search-results is.  and since we are using .html we are replacing the previous html. 
  $('.js-search-results').html(resultHTML);                                   
// if there is something called previous page token (if it exists in the data) then.
// so below, the html will append with what is in the anchor tag.  remeber html clears it out and append shows stuff on the screen without clearing it.  html and append are both used to show the same things on the screen but html blows it away and displays it new and append tacks it on the end.  
// searchterm and pagetoken are stored.
  if (data.prevPageToken) {   
    $(".js-search-results").append(`
    <a class="next-previous-link" data-searchterm="${searchTerm}" data-pagetoken="${data.prevPageToken}">Previous</a>`
    )
  } 
  if (data.nextPageToken) {
    // remeber dont put spaces that you dont want in a template literal
    $(".js-search-results").append(`
    <a class="next-previous-link" data-searchterm="${searchTerm}" data-pagetoken="${data.nextPageToken}">Next</a>
    `
    )
  }
}

// this is if you click on one of the next or previous buttons.
function addNextPreviousHandler() {            
  $('main').on('click', '.next-previous-link', function(event) {
    const searchTerm = $(event.currentTarget).data("searchterm");
    const pageToken = $(event.currentTarget).data("pagetoken");
// now running getDataFromAPI with all 3 params
    getDataFromApi(searchTerm, displayYouTubeSearchData, pageToken);  
  });
}

function addFormSubmitHandler() {
// assigning an event handler           
  $('.js-search-form').submit(function(event) {                      
    event.preventDefault();                                            
// find the text box
    const textBox = $(event.currentTarget).find('.js-query');
// gets text out 
    const searchTerm = textBox.val();                                      
// clear out
    textBox.val("");
// displayYouTubeSearchData is the callback
// run getDataFromApi using the searchterm and run display youtuibesearch data when you are finished.
// go into the world and call me when you get the information  
    getDataFromApi(searchTerm, displayYouTubeSearchData);        
  });
}

function initializeApp() {
  addFormSubmitHandler();                                            
  addNextPreviousHandler();
}

$(initializeApp);
