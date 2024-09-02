function HomePage() {
  return (
    <div>
      <link rel="stylesheet" href="/css/style.css"></link>
      <header>
        <logo>Movie Review</logo>
        <menu>Menu</menu>
        <div class="search-container">
            <input type="text" placeholder="Search Movie" class="search-input"/>
            <button type="submit" class="search-button">Search</button>
        </div>
        <watchlist>Watchlist</watchlist>
        <signin>Sign In</signin>
        <language>EN</language>
      </header>
      <body>
        <div class="image-container">
          <img src="/img/film1.jpg" alt="Boboiboy Movie" class="styled-image"/>
          <div class="gradient-overlay"></div>
          <div class="text-film">
              <filmtitle>Lorem</filmtitle>
              <subtitle>Watch Lorem Trailer</subtitle>
          </div>
          <div class="play-button-container">
            <button class="play-button">
              <span class="play-icon">▶</span>
            </button>
          </div>
        </div>
        <div class="next-film">
          <upnext>Up next</upnext>
          <div class="square">
            <div class="item">
            <img src="/img/film1.jpeg" alt="Boboiboy Mv" class="styled-image-preview"/>
            <div class="play-button-container-mini">
              <button class="play-button-mini">
               <span class="play-icon-mini">▶</span>
              </button>
            </div>
            <p>Lorem Ipsum Dolor</p>  
            </div>  
            <div class="item">
            <img src="/img/film1.jpeg" alt="Boboiboy Mv" class="styled-image-preview"/>
            <div class="play-button-container-mini">
              <button class="play-button-mini">
               <span class="play-icon-mini">▶</span>
              </button>
            </div>
            <p>Lorem Ipsum Dolor</p>  
            </div>
            <div class="item">
            <img src="/img/film1.jpeg" alt="Boboiboy Mv" class="styled-image-preview"/>
            <div class="play-button-container-mini">
              <button class="play-button-mini">
               <span class="play-icon-mini">▶</span>
              </button>
            </div>
            <p>Lorem Ipsum Dolor</p>
            </div>
          </div>
          <browse>Browse trailers</browse>
        </div>
      </body>
    </div>
  );
}
export default HomePage;