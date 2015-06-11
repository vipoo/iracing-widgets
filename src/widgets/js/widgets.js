var $ = require('jquery');
var slickCarousel = require('slick-carousel');

const href = __DEV__ ? 'http://www.widgets-iracing.net.dev/main.css' : 'http://www.widgets-iracing.net/main.css';

(function(){
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  document.getElementsByTagName('head')[0].appendChild(link);

  $(document).ready(function() {
    $('.iracing-widget .leagueMemberHighlights').slick(/*{
      autoplay: true,
      autoplaySpeed: 2000,
    }*/);
  });
})();
