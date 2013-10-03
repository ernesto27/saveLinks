var cheerio = require('cheerio');
function randomArray(array){
	var len = array.length;
  	var random = Math.floor(Math.random() * len);
  	return array[random];
}

exports.getImageTitlePage = function getImagePage(body){
  	var $ = cheerio.load(body);
  	//console.log($)
  	imgs = "";
  	imgArray = [];
  	$("img").each(function(){
  		var src = $(this).attr("src");
  		if (/^https?/.test(src)){
  			imgArray.push(src);
  		}
  	});

    return{
      img: randomArray(imgArray),
      title: $("title").text()
    }

  	//randImage = randomArray(imgArray);
  	//return randImage;
}

