const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync')

const fs = require('fs');

console.log("Olá, sou o IMGBOT. Trarei as imagens que encontrar! 🤖");

(async () => {

    const browser = await puppeteer.launch({
        devtools: true,
        headless: false
    });
    // Cria uma nova página
    const page = await browser.newPage();

    // Configuração do timeout de navegação
    await page.setDefaultNavigationTimeout(0);

    const search = readlineSync.question("Que tipo de imagens voce busca?: ");
    const websiteForScrapping = `https://www.pexels.com/pt-br/procurar/${search}/` || 'https://www.pexels.com/pt-br/';


    await page.goto(websiteForScrapping, { waitUntil: 'load' });
    await Promise.all([
        page.waitForNavigation({
            waitUntil: 'networkidle0',
        }),
    ]);

    const imgList = await page.evaluate(() => {
        // Toda essa função será executada no browser utilizando DOM.

        // Pegar todas as imagens que estao na parte de posts
            const nodeList = document.querySelectorAll('.photo-item__link .photo-item__img');
        // Transformar o NodeList em array
            const imgArray = [...nodeList]

        // Transformar os nodes (elementos html) em objetos JS
            const imgList = imgArray.map( ({src}) => ({
                src
            }))

        // Colocar para fora da função
        return imgList
    })

    // escrever os dados em um arquivo local (json)
    fs.writeFile('pexels.json', JSON.stringify(imgList, null, 2), err => {
        if(err) throw new Error('something went wrong') 

        console.log('well Done \ndigite npx lite-server, para ver imagens encontradas!')
    })

    await browser.close();
    
})();

