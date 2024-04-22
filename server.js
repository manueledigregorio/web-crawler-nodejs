async function crawler(){
    const axios = require("axios");
    //TRAMITE UNA CHIAMATA AXIOS MEMORIZZO IN pageHTML TUTTO HTML DI https://scrapeme.live/shop
    const pageHTML = await axios.get("https://scrapeme.live/shop");

    //Cheerio è una libreria JavaScript utilizzata principalmente per analizzare e manipolare il DOM
    const cheerio  = require("cheerio");


    // funzione load() di Cheerio per caricare il contenuto preso prima 
    const $ = cheerio.load(pageHTML.data);

    const paginationURLs = [];
    const productURLs = [];
    // Recupero tutte url del tag a faccio il foreach per iterarli tutti
    $(".page-numbers a ").each((index, element) => {
        const paginationURL = $(element).attr("href");
        paginationURLs.push(paginationURL);
    });

    // retrieving the product URLs 
    $("li.product a.woocommerce-LoopProduct-link").each((index, element) => { 
        const productURL = $(element).attr("href");
        productURLs.push(productURL);
    });

    for( const DetailUrl of productURLs ){
        await scrapeProductDetails(DetailUrl)
    }

    console.log("URL delle pagine di paginazione:");
    console.log(paginationURLs);

    // Stampare le URL dei prodotti
    console.log("URL dei prodotti:");
    console.log(productURLs);
};

async function scrapeProductDetails(DetailUrl){

    const axios = require("axios");
    const cheerio = require("cheerio");
 // Eseguo una richiesta HTTP per recuperare il contenuto della pagina del prodotto
    const response = await axios.get(DetailUrl);
    const $ = cheerio.load(response.data);

    const productName = $(".product_title").text().trim();
    const productPrice = $(".woocommerce-Price-amount").text().trim();
    const productDescription = $(".woocommerce-product-details__short-description p").text().trim();
    const productImage =$(".woocommerce-product-gallery__image a ").attr("href");

    console.log("Nome del prodotto:", productName);
    console.log("Prezzo del prodotto:", productPrice);
    console.log("Descrizione del prodotto:", productDescription);
    console.log("Descrizione img:", productImage);

}

crawler();