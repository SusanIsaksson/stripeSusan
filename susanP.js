//Co-authored-by: Susan Isaksson <SusanIsaksson@users.noreply.github.com> || Co-authored-by: Linda G <Pindilind@users.noreply.github.com>

//let stripe = Stripe('pk_test_51JbhAtI15NR3oivl1Rxdgpnad3GN14mR2OTtJbM2e6VNPEa1cYL7PTMdHBlpU2aUGa4ncdbvUyBiUZ16303LmKq100BkngM59V');
let stripe = Stripe('pk_test_51JZwfhIMTHb0TS9a5j5WbnuPHSwsdmvhjvM4FCmlQP9L6dKJhsSekUu99eCFTAy0pqMeHyGAQSejOfPCzlLyd3TL006JYP3wyJ');


const productDB = {
    "TestProduct": {
        description: "produktbeskrivning",
        price_data: {
            currency: "sek",
            product_data: {
                name: "produktnamn"
            },
            unit_amount: 1000
        },
    },
}

let cart = {};


const addProduct = async (productKey) => {
    
    const product = productDB[productKey];

    cart[productKey] = cart[productKey] || product;
    cart[productKey].quantity = cart[productKey].quantity || 0;
    cart[productKey].quantity++;

    document.getElementById("cartCounter").innerHTML = cart[productKey].quantity;
    console.log({ cart, line_items: Object.values(cart) });


}

document.getElementById("addProd").addEventListener("click", () => addProduct ("TestProduct"))

async function checkoutBtn() {

    try {

        if (Object.keys(cart).length == 0) {
            throw new Error("You cart is empty!");
        }

        const response = await fetch('api/session/new', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                line_items: Object.values(cart)
            })
        });
        const { id } = await response.json();
        localStorage.setItem("session", id)

        stripe.redirectToCheckout({ sessionId: id })

    } catch (err) {
        console.log(err)
    }
}

async function verify() {
    try {
        const sessionId = localStorage.getItem('session')
        console.log(sessionId)

        if (!sessionId) {
            throw new Error("inget session ID");
        }

        const response = await fetch('api/session/verify', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId
            })
        });
        const { paid } = await response.json();
        console.log(paid)
        return paid;
        

    } catch (err) {
        console.log(err)
        return false;
    }
}

//Co-authored-by: Susan Isaksson <SusanIsaksson@users.noreply.github.com> || Co-authored-by: Linda G <Pindilind@users.noreply.github.com>

 async function main() {
     const isVerified = await verify();
     console.log(isVerified)

     if(localStorage.getItem('session')) {
     if(isVerified) {
         alert("tack")
     } else {
         alert("jaha")
     }
     localStorage.removeItem('session')
} 

}

main();