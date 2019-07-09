function logURL(request) {
	if(request.url.indexOf('/video/play') >= 0) {
	  	var decoder = new TextDecoder("utf-8");
	  	var encoder = new TextEncoder();

  		var filter = browser.webRequest.filterResponseData(request.requestId);
  		var data = [];

	  	filter.ondata = event => {
		    data.push(event.data);
	  	};

	  	filter.onstop = event => {
	  		var dataStr = data.join('');
	  		try {
		    	var js = JSON.parse(decoder.decode(dataStr));
		    	if(js && js.data && js.data.info && js.data.info[0]) {
		    		var info = js.data.info[0];

		    		var flvPathList = info.flvPathList || [];
		    		flvPathList.splice(0, flvPathList.length - 1);

		    		info.pauseData = [];
		    		info.startData = [];
		    		
		    		dataStr = encoder.encode(JSON.stringify(js));
		    	}
		    } catch(e) {
		    	console.log(e);
		    }
		    filter.write(dataStr);
		    filter.disconnect();
	  	};
	}
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["*://*.ifun.tv/api/*"]},
  ["blocking"]
);
