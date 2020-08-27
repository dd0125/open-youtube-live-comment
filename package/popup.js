function createVideoSelectorElement(youtubeData) {
    const videoId = youtubeData.id;
    const videoTitle = youtubeData.title;

    const selectorElement = document.createElement('div');
    selectorElement.classList.add('selector');
    selectorElement.setAttribute('id', videoId);

    // サムネイル
    const thumbnailElement = document.createElement('img');
    // http://img.youtube.com/vi/R_orQNBgzLc/default.jpg
    const imageUrlElement = `http://img.youtube.com/vi/${videoId}/default.jpg`;
    thumbnailElement.src = imageUrlElement;
    thumbnailElement.classList.add('thumbnail');
    selectorElement.append(thumbnailElement);

    // タイトル
    const titleElement = document.createElement('span');
    titleElement.innerHTML = videoTitle;
    titleElement.classList.add('title');
    titleElement.classList.add('wf-mplus1p');
    selectorElement.append(titleElement);

    // クリックイベント
    selectorElement.addEventListener('click', function(event) {
        const currentTarget = event.currentTarget;
        const videoId = currentTarget.getAttribute('id');
        // alert(videoId);

        const openUrl = `https://www.youtube.com/live_chat?v=${videoId}`;

        chrome.tabs.create({ url: openUrl });
    });
    return selectorElement;
}

chrome.tabs.query({currentWindow: true}, function(tabs) {
    let youtubeDataArray = [];
    tabs.forEach(function(tab) {
        const url = tab.url;
        const tabTitle = tab.title;

        if(url.startsWith('https://www.youtube.com/watch?')){
            const matchResult = url.match(/www.youtube.com\/watch\?v=([^&]+)/);
            const videoTitle = tabTitle.replace(/ - YouTube$/, "");
            if(matchResult.length > 0){
                const videoId = matchResult[1];
                const youtubeData = {
                    url: url,
                    title: videoTitle,
                    id: videoId,
                };
                youtubeDataArray.push(youtubeData);
            }
        }

    });
    const selectorAreaElement = document.querySelector('.selector-area');
    for(let youtubeData of youtubeDataArray){
        const videoSelectorElement = createVideoSelectorElement(youtubeData);

        selectorAreaElement.append(videoSelectorElement);
    }

});