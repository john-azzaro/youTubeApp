"use strict";

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';     
const YOUTUBE_API_KEY = 'AIzaSyAuqE0-TIkITIqLiMivkFykEh_bJeg-kDk';              

function getDataFromApi(searchTerm, callback, pageToken) {        
  const requestData = {                                        
    q: `${searchTerm}`,                        
    part: 'snippet',   
    key: YOUTUBE_API_KEY,                                   
  }
  if (pageToken) { requestData.pageToken = pageToken; }                             
  function success(responseData) {              
    callback(responseData, searchTerm);         
  }       
  $.getJSON(YOUTUBE_SEARCH_URL, requestData, success);              
}

function renderResult(result) {      
  return ` 
  <li>
    <a href="https://youtu.be/${result.id.videoId}"> <img src="${result.snippet.thumbnails.medium.url}"> </a>
    <a href="https://youtube.com/channel/${result.snippet.channelId}">More from this channel!</a>
  </li>
  `;
}

function displayYouTubeSearchData(data, searchTerm) {                  
  const results = data.items.map((item) => renderResult(item)).join("\n");      
  const resultHTML = `<ul>${results}</ul>`;
  $('.js-search-results').html(resultHTML);                                   
  if (data.prevPageToken) {   
    $(".js-search-results").append(`
    <a class="next-previous-link" data-searchterm="${searchTerm}" data-pagetoken="${data.prevPageToken}">Previous</a>`
    )
  } 
  if (data.nextPageToken) {
    $(".js-search-results").append(`
    <a class="next-previous-link" data-searchterm="${searchTerm}" data-pagetoken="${data.nextPageToken}">Next</a>
    `
    )
  }
}

function addNextPreviousHandler() {            
  $('main').on('click', '.next-previous-link', function(event) {
    const searchTerm = $(event.currentTarget).data("searchterm");
    const pageToken = $(event.currentTarget).data("pagetoken");
    getDataFromApi(searchTerm, displayYouTubeSearchData, pageToken);  
  });
}

function addFormSubmitHandler() {        
  $('.js-search-form').submit(function(event) {                      
    event.preventDefault();                                            
    const textBox = $(event.currentTarget).find('.js-query');
    const searchTerm = textBox.val();                                      
    textBox.val(""); 
    getDataFromApi(searchTerm, displayYouTubeSearchData);        
  });
}

function initializeApp() {
  addFormSubmitHandler();                                            
  addNextPreviousHandler();
}

$(initializeApp);









