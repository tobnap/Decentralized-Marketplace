var node;
var db;
var items;

async function init () {
    var loader = $('#loader');
    var content = $('#content');

    // Show loader and hide content while until everything has loaded
    loader.show();
    content.hide();

    // Initialize ipfs node and use it to initialize the database
    node = await window.Ipfs.create();
    db = await initDB(node);

    console.log(db.address.toString());

    // Fetch all items from database
    items = await db.find();

    //await addItem(db, items.length, 'file:///C:/Users/tobna/git/idk/src/item.html', 'https://discountseries.com/wp-content/uploads/2017/09/default.jpg', 'test', 20, 10)

    console.log(items);

    // For each item in the databse make a item card
    for (var i = 0; i < items.length; i++) {
        createItemCard(items[i].page, items[i].img, items[i].name, items[i].price, items[i].stock, i);
    }

    // Now that everything has loaded hide the loader and show the content
    loader.hide();
    content.show();
}

function createItemCard (itemPage, itemImg, itemName, itemPrice, itemStock, itemIndex) {
    $("#item-container").append(`
        <div class='card-container'>
            <div class='card'>
                <a href=${itemPage}>
                    <img src=${itemImg} style='width:100%'>
                    <h1>${itemName}</h1>
                </a>
                <p class='subtext'>$${itemPrice}</p>
                <p class='subtext stock'>Stock: </p>
                <p class='subtext stock stockNum'>${itemStock}</p>
                <p><button onclick='addToCart(${itemIndex})'>Add to Cart</button></p>
            </div>
        </div>
    `);
}

var shoppingCartList = [];

function addToCart (itemIndex) {
    // If item is in stock continue otherwise display that it is out of stock
    if (items[itemIndex].stock > 0) {
        shoppingCartList.push(itemIndex);
        items[itemIndex].stock = items[itemIndex].stock - 1;
        $('.stockNum').text(items[itemIndex].stock);
    } else {
        alert("Out of stock");
    }
}

function checkout () {
    var total = 0;

    for (var i = 0; i < shoppingCartList.length; i++) {
        total = total + items[shoppingCartList[i]].price;
    }

    alert(total);
}

async function initDB(ipfs) {
    const options = {
        // Give write access to everyone
        accessController: {
          write: ['*']
        }
    }

    // Creates a db named DecentralizedStore
    //const aviondb = await AvionDB.init("Decentralized-Store", ipfs);
    const aviondb = await AvionDB.open("/orbitdb/zdpuAkzbX6qGMC3XPshsg8NAusVmeN18W5c7tqisM5DvvYrxE/items", ipfs, options);

    // Creates a Collection named items
    //const collection = await aviondb.initCollection("items");

    return aviondb;
};

async function addItem (db, index, page, img, name, price, stock) {
    // Adding a page to the db
    await db.insertOne({
        index: index,
        page: page,
        img: img,
        name: name,
        price: price,
        stock: stock
    });
}

$(window).on('load', function(){
    init();
});