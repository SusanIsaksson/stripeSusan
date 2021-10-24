let stripe = Stripe('pk_test_51JZwfhIMTHb0TS9a5j5WbnuPHSwsdmvhjvM4FCmlQP9L6dKJhsSekUu99eCFTAy0pqMeHyGAQSejOfPCzlLyd3TL006JYP3wyJ');

const productDB = [{
    "productOne": {
        description: "Ahlgrens Bilar - original",
        price_data: {
            currency: "sek",
            product_data: {
                name: "klassiska Ahlgrens bilar smaker"
            },
            unit_amount: 1200
        },
    },

    "productTwo": {
        description: "Ahlgrens Bilar - saltlaktrits",
        price_data: {
            currency: "sek",
            product_data: {
                name: "Ahlgrens bilar med smak av saltlakrits"
            },
            unit_amount: 1500
        },
    },
}]

const renderProducts = async (productDB)  => {

    let products = productDB
    console.log(products)

    document.getElementById('productItem').innerHTML = "";
    //document.getElementById('mainCart').innerHTML = ""

    products.forEach(product => {
        console.log(product)
    
    let renderCard = document.createElement('div');
    renderCard.style.height = "auto";
    renderCard.style.margin = "2px"
    
    let cardBody = document.createElement('div');
    cardBody.style.width = "250px";
 
    let productImg = document.createElement('img');
    productImg.style.height = "10em";
    productImg.style.width = "10em";
    productImg.style.objectFit = "contain";
    productImg.style.background = "lightgreen";
    productImg.style.maxHeight = "10em";

    let productTitle = document.createElement('h2');
    productTitle.innerText = "ProduktTitel";
    //product.name / product.price_data.product_data.name

    let productDescription = document.createElement('h4');
    productDescription.innerText = "Ahlgrens original smaker";
    //product.description
    
    let productPrice = document.createElement('h4');
    productPrice.innerText = "100 kr";
    //product.price_data.amount
    
    let addBtn = document.createElement('button');
    addBtn.innerText = "Lägg i varukorg";
    addBtn.style.background = "rgb(28, 58, 28)";
    addBtn.data = product
    addBtn.addEventListener('click', addToCart);
    
    
    let deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = "Ta bort"
    deleteBtn.addEventListener('click', deleteProductItem);

    cardBody.append(productImg)
    cardBody.append(productTitle)
    cardBody.append(productDescription)
    cardBody.append(productPrice)
    cardBody.append(addBtn)
    cardBody.append(deleteBtn)
    renderCard.append(cardBody)

    document.getElementById("productCard").appendChild(renderCard)
    })
}

    
    

//const productItems = ['one', 'two', 'three', 'four']

//productItems.forEach(element => console.log(element));


let cart = {};


const addToCart = async (productKey) => {

    let cartItemList = []
    
        for (let i = 0; i < cartItemList.length; i++) {
            const checkID = cartItemList[i].sessionId;

            if (!cartItemList) {
                throw new Error ("Product does not exist")
            } 

            updateCartCounter()
            return
        }
        
        //const product = productDB[productKey];
        
        
        /* cart[productKey] = cart[productKey] || product;
        cart[productKey].quantity = cart[productKey].quantity || 0;
        cart[productKey].quantity++;  */
        
        //document.getElementById("cartCounter").innerHTML = cart[productKey].quantity;
}
        console.log({ cart, line_items: Object.values(cart) });


//document.getElementById("addItem").addEventListener('click', () => addToCart ("productOne"))

const checkout = async () => {
    
    try {
        if (Object.keys(cart).length == 0) {
            throw new Error("Your cart is empty, nNo products added");
        }
        const response = await fetch('/api/session/new', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                line_items: Object.values(cart)
            })
        });
        
        const { id } = await response.json();
        //Storage.setItem('session', id)
        sessionStorage.setItem("session", id)

        stripe.redirectToCheckout({ sessionId: id }); 

        /* const newSessionId = { session_id: id } 
        const saveSession = await makeRequest('http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}', "POST", {session_id: "123"})
        console.log(newSessionId)
        stripe.redirectToCheckout({ session_id: session_id}); */
        
    }   catch(err) {
        console.log(err)
    }
}
document.getElementById("checkOut").addEventListener('click', () => checkout());

const verify = async() => {
    
    try {
        //const documentURL = ""
        //const sessionId = documentURL.getItem("session");
        const stripeSessionId = sessionStorage.getItem('session');
       
        if (!stripeSessionId) {
            throw new Error("No session id to verify");
        } 
        // rad 77 error "failed to fetch"
        const response = await fetch('/api/session/verify', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                //sessionId: sessionId
                stripeSessionId
                
            })
        });
        /* const { id } = await response.json();
        return true; */

        const { paid } = await response.json();
        return paid;        
        
    }   catch(err) {
        console.log(err)
        return false;
    }
}

async function main() {

    verify();
    
    /* const sessionId = sessionStorage.getItem("session");
    console.log(sessionId) */
    
    
    const isVerified = await verify();
    console.log("isVerified", isVerified)
    
    if (sessionStorage.getItem("session")){
        
        if(isVerified) {
            alert ("Tack för ditt köp!")
        }   else {
            alert ("Ditt köp avbröts, försök igen!")
        }
    }

 
}

main();
