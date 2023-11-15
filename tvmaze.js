"use strict";

const TVMAZE_BASE_URL = "http://api.tvmaze.com/";
const missingImg = `https://tinyurl.com/tv-missing`;

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {

  // TODO: can omit and keep it in parameter^^
  const searchTerm = term;

  console.log("This is searchTerm=", searchTerm);


  const searchParam = new URLSearchParams(
    {
      q: searchTerm
    }
  );

  const response = await fetch(
    `${TVMAZE_BASE_URL}search/shows?${searchParam}`
  );

  console.log("This is response=", response);

  const showsData = await response.json();

  console.log("This is showData=", showsData);

  let shows = [];

  // TODO: example using map
  // const shows = showData.map(entries => {
  //   if (!entries.show.image) {
  //     var { id, name, summary, image = null } = entries.show;
  //   } else {
  //     var { id, name, summary, image } = entries.show;
  //   }

  //   entries = { id, name, summary, image };
  //   entries.image = image ? image.medium : missingImg;
  //   return entries;
  // });

  for (let showInfo of showsData) {

    if (!showInfo.show.image) {
      let { id, name, summary, image = null } = showInfo.show;
      showInfo = { id, name, summary, image };
    } else {
      let { id, name, summary, image } = showInfo.show;
      showInfo = { id, name, summary, image };
    }

    showInfo.image = showInfo.image ? showInfo.image.medium : missingImg;
    shows.push(showInfo);
  }
  console.log('the result', shows);
  return shows;

}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();

  // TODO: not working
  $searchForm.val("");
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
