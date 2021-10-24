//renderar ut på kundkorgssidan
const renderCartPage = async () => {
   
    const main = document.getElementById('mainCart')
    
    //skriver ut "Din varukorg är tom"
    if (Object.keys(cart).length == 0) {
        throw new Error("Your cart is empty, no products added");
    }

    let emptyCart = document.createElement("p")
    emptyCart.innerText = "Din varukorg är tom"
    main.appendChild(emptyCart)

    let flexItem = document.createElement('div')
    main.appendChild(flexItem)

    let viewCartItem = document.createElement('div')
    flexItem.appendChild(viewCartItem)

    let productTitle = document.createElement('h2')
    productTitle.innerText = "Ahlgrens Bilar - original"
    //productDB.description 

    let productDescription = document.createElement('h4')
    productDescription.innerText = "Ahlgrens original smaker"

    let productPrice = document.createElement('h4')
    productPrice.innerText = "12.00 kr"

    let deleteButton = document.createElement('button')
    deleteButton.append(deleteButtonText)
    deleteButton.addEventListener('click', () => {
        RemoveFromCart(index)
    })
    let deleteButtonText = document.createElement('p')
    deleteButtonText.innerHTML = "Ta bort"
    
    viewCartItem.append(productTitle, productPrice, deleteButton)
}