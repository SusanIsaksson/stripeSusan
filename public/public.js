let stripe = Stripe('pk_test_51JZwfhIMTHb0TS9a5j5WbnuPHSwsdmvhjvM4FCmlQP9L6dKJhsSekUu99eCFTAy0pqMeHyGAQSejOfPCzlLyd3TL006JYP3wyJ');

const productDB = {
    "productOne": {
        description: "Ahlgrens Bilar - original",
        price_data: {
            currency: "sek",
            product_data: {
                name: "klassiska Ahlgrens bilar smaker"
            },
            unit_amount: 1290
        },
    },
    "productTwo": {
        description: "Ahlgrens Bilar - saltlakrits",
        price_data: {
            currency: "sek",
            product_data: {
                name: "Ahlgrens bilar med smak av saltlakrits"
            },
            unit_amount: 1490
        },
    },
}

let cart = {};

const addProduct = async (productKey) => {
    const product = productDB[productKey];
    if (!product) {
        throw new Error ("Product does not exist")
    }

    cart[productKey] = cart[productKey] || product;
    cart[productKey].quantity = cart[productKey].quantity || 0;
    cart[productKey].quantity++;
    console.log({ cart, line_items: Object.values(cart) });

    document.getElementById("counter").innerHTML = cart[productKey].quantity;

  
}

document.getElementById("prodOne").addEventListener("click", () => addProduct ("productOne"));
document.getElementById("prodTwo").addEventListener("click", () => addProduct ("productTwo"));
