const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const getData = async () => {
    const browser = await puppeteer.launch({args:['--start-maximized']});
    const page = await browser.newPage();
    await page.goto('https://www.playcrey.com/play/MostPlayed');
    await page.setViewport({ width: 1366, height: 768});
    const mostPlayed = '.Cell__CreyCell-sc-oqhq6s-0.hXtDiV a';
    await page.waitForSelector(mostPlayed);
    const links = await page.evaluate(() => {
        const elements =  document.querySelectorAll('.Cell__CreyCell-sc-oqhq6s-0.hXtDiV a');
        let links = [];
        for (let element of elements) {
            links.push(element.href)
        }
        return links;
    });
    let pagesData = [];
    for (let enlace of links) {
        await page.goto(enlace, { waitUntil: 'networkidle0' });
        pagesData.push(await page.evaluate(() => {
            pageData = {};
            pageData.gameData = {};
            aux = {};
            aux.commentData = [];
            aux.gameData = [];

            pageData.gameData.gameTitle = document.querySelector('.GameTitle--1bsl3h6')?.innerText;
            pageData.gameData.gameId = document.URL.split('/').slice(-1)[0];
            pageData.gameData.gameCreator = document.querySelector('.CreatorName--1yloycb span')?.innerText;
            pageData.gameData.gameCreatorId = document.querySelector(".ProfileWrapper--1flmfhj.fLBrjQ > a").href.split('/').slice(-1)[0];
            pageData.gameData.numPlays = document.querySelector('.GameInfos--1l73nut.jQsNle div:nth-child(2) span')?.innerText.split(' ')[0];
            pageData.gameData.numLikes = document.querySelector(".sc-ftTHYK.bbOCCx.StyledLikeButton--5zu5oc.heOSga > span").innerText.split(' ')[0];
            pageData.gameData.isMultiplayer = document.querySelector('.GameInfoDataWrapper--1y8mrvj.hMkHRj span')?.innerText?.toLowerCase() === 'multiplayer';
            pageData.gameData.isSingleplayer = document.querySelector('.GameInfoDataWrapper--1y8mrvj.hMkHRj span')?.innerText?.toLowerCase() === 'singleplayer';
            pageData.gameData.numComments = document.querySelector('sc-dkrFOg.bvPVyW.StyledHeadline--7dub8s.cHgJxq span')?.innerText;
            aux.gameData.push(pageData.gameData);
            for(comentario of document.querySelectorAll('.CommentContainer--16aic79.hIrtdg')) {
                commentData = {};
                commentData.gameId = document.querySelector("li.user-menu-item a").href.split('/').slice(-1)[0];
                commentData.gameTitle = document.querySelector('.GameTitle--1bsl3h6')?.innerText;
                commentData.comment = comentario.querySelector("p.body-text")?.innerText;
                commentData.commentCreator = comentario.querySelector("div a")?.innerText;
                commentData.commentCreatorId = comentario.querySelector("div a").href.split('/').slice(-1)[0];
                commentData.commentTime = comentario.querySelector("div > span time").getAttribute('datetime');
                aux.commentData.push(commentData);
                commentData = {};
            };
            return aux;
        }));
    }
    await browser.close();
    return pagesData;
};

// TO CSV

const EliFunction = (data, filename) => {
    // Definir la ruta y el nombre del archivo CSV
    let header = [];
    if (filename == 'comments') {
        header = [
            {id: 'gameId', title: 'Id del juego'},
            {id: 'gameTitle', title: 'Titulo del juego'},
            {id: 'comment', title: 'Comentario'},
            {id: 'commentCreator', title: 'Creador del comentario'},
            {id: 'commentCreatorId', title: 'Id del creador del comentario'},
            {id: 'commentTime', title: 'Fecha de publicacion del comentario'},
        ]
    } else {
        header = [
            { id: 'gameTitle', title: 'Titulo del juego' },
            { id: 'gameId', title: 'Id del juego' },
            { id: 'gameCreator', title: 'Creador del juego' },
            { id: 'gameCreatorId', title: 'Id del creador del juego' },
            { id: 'numPlays', title: 'Num veces jugado' },
            { id: 'numLikes', title: 'Num Likes' },
            { id: 'isMultiplayer', title: 'Multijugador' },
            { id: 'isSingleplayer', title: 'Un jugador' },
        ]
    }
    const csvWriter = createCsvWriter({
    path: filename + '.csv',
    header: header
    });

    // Escribir los datos en el archivo CSV
    csvWriter
    .writeRecords(data)
    .then(() => console.log('El archivo CSV ha sido guardado exitosamente.'))
    .catch((error) => console.error('Error al guardar el archivo CSV:', error));
};

const getDataAndCSV = async ()=> {
    const allGamesData = await getData();
    let comments = [];
    let games = [];
    for(oneGameData of allGamesData) {
        games.push(oneGameData.gameData);
        comments.push(oneGameData.commentData);
    }
    console.log(games)
    EliFunction(comments.flat(), 'comments');
    EliFunction(games.flat(), 'games');
}

module.exports = getDataAndCSV;