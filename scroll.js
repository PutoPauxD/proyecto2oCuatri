const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({args:['--start-maximized'], headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.playcrey.com/game/63748', {waitUntil: "networkidle0"});
    await page.setViewport({ width: 1366, height: 768});
    let pagesData = [];
    // pagesData.push(await page.evaluate(() => {
    //     pageData = {};
    //     pageData.gameData = {};
    //     aux = {};
    //     aux.commentData = [];
    //     aux.gameData = [];

    //     pageData.gameData.gameTitle = document.querySelector('.GameTitle--1bsl3h6')?.innerText;
    //     pageData.gameData.gameId = document.URL.split('/').slice(-1)[0];
    //     pageData.gameData.gameCreator = document.querySelector('.CreatorName--1yloycb span')?.innerText;
    //     pageData.gameData.gameCreatorId = document.querySelector(".ProfileWrapper--1flmfhj.fLBrjQ > a")?.href.split('/').slice(-1)[0];
    //     pageData.gameData.numPlays = document.querySelector('.GameInfos--1l73nut.jQsNle div:nth-child(2) span')?.innerText.split(' ')[0];
    //     pageData.gameData.numLikes = document.querySelector(".sc-ftTHYK.bbOCCx.StyledLikeButton--5zu5oc.heOSga > span")?.innerText.split(' ')[0];
    //     pageData.gameData.isMultiplayer = document.querySelector('.GameInfoDataWrapper--1y8mrvj.hMkHRj span')?.innerText?.toLowerCase() === 'multiplayer';
    //     pageData.gameData.isSingleplayer = document.querySelector('.GameInfoDataWrapper--1y8mrvj.hMkHRj span')?.innerText?.toLowerCase() === 'singleplayer';
    //     pageData.gameData.numComments = document.querySelector('sc-dkrFOg.bvPVyW.StyledHeadline--7dub8s.cHgJxq span')?.innerText;
    //     aux.gameData.push(pageData.gameData);
    //     for(comentario of document.querySelectorAll('.CommentContainer--16aic79.hIrtdg')) {
    //         commentData = {};
    //         commentData.gameId = document.querySelector("li.user-menu-item a")?.href.split('/').slice(-1)[0];
    //         commentData.gameTitle = document.querySelector('.GameTitle--1bsl3h6')?.innerText;
    //         commentData.comment = comentario.querySelector("p.body-text")?.innerText;
    //         commentData.commentCreator = comentario.querySelector("div a")?.innerText;
    //         commentData.commentCreatorId = comentario.querySelector("div a")?.href.split('/').slice(-1)[0];
    //         commentData.commentTime = comentario.querySelector("div > span time")?.getAttribute('datetime');
    //         aux.commentData.push(commentData);
    //         commentData = {};
    //     };
    //     return aux;
    // }));
    let items = [];
    const numCommentsTotal = await page.evaluate(() => {return document.querySelector('.sc-dkrFOg.bvPVyW.StyledHeadline--7dub8s.cHgJxq > span').innerText.replace(/[^0-9]/g,"")});
    let numCommentsActual = 0;
    page.waitForSelector('p.body-text')
    while (numCommentsTotal > numCommentsActual) {
        items = await page.evaluate(() => {return document.querySelectorAll('.CommentContainer--16aic79.hIrtdg')});
        await console.log(items)
        numCommentsActual = items?.length;
        await console.log(numCommentsActual);
        await new Promise((resolve)=> setTimeout(resolve, 2000));
    };
    
    await console.log(items);
    await browser.close();
    await console.log(pagesData);
})();

// TO CSV
