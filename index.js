// //contentful connect
// const client = contentful.createClient({
//   space: "68x4dwiyco8j",
//   accessToken: "3-YQP_PRVfEmCdz1N-NyvkLNab_TNVwBGt_01VrzGbc"
// });

// DOM VARIABLE SELECTIONS
const productsDOM = document.querySelector(".products-center");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartContent = document.querySelector(".cart-content");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const clearCart = document.querySelector(".clear-cart");
const closeCart = document.querySelector(".close-cart");
const cartBtn = document.querySelector(".cart-btn");
const itemAmount = document.querySelector(".item-amount");
const itemPrice = document.querySelector(".item-price");

let cart = [];
let BtnDom = [];

// PRODUCT CLASS
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      const products = data.items.map(item => {
        const { id } = item.sys;
        const { title } = item.fields;
        const { price } = item.fields;
        const image = item.fields.image.fields.file.url;
        return { id, title, price, image };
      });
      return products;

      // try {
      //   let contentful = await client.getEntries({
      //     content_type: "headPhonesHub"
      //   });
      //   let products = contentful.items;
      //   products = products.map(item => {
      //     const { title, price } = item.fields;
      //     const { id } = item.sys;
      //     const image = item.fields.image.fields.file.url;
      //     return { title, price, id, image };
      //   });
      //   return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// UI CLASS
class UI {
  displayProducts(products) {
    let result = "";
    products.map(product => {
      result += `
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
          </div>
        </article>
        `;
    });
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    BtnDom = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      //Check Cart
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", e => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        // // Add Item to Cart in Storage
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
          singleTotalPrice: Storage.getProduct(id).price
        };

        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        //Add Single Item  to DOM
        this.addCartContent(cartItem);
        // Set cart Value
        this.setCartValues(cart);
        //ShowCart
        this.showCart();
      });
    });
  }

  showCart() {
    if (cart.length <= 0) {
      this.hideCart();
    }
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCart.addEventListener("click", this.hideCart);
    clearCart.addEventListener("click", e => {
      cart.forEach(item => {
        this.removeOne(item.id);
        while (cartContent.children.length > 0) {
          cartContent.removeChild(cartContent.children[0]);
        }
      });
    });
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  setCartValues(cart) {
    // Set Cart Item Length
    let cartItemNo = cart.length;
    cartItems.innerText = cartItemNo;
    if (cartItemNo === 0) this.hideCart();
    // Calculate total price of all items
    let total = 0;
    total = cart.reduce((acc, curr) => {
      return acc + curr.price * curr.amount;
    }, 0);
    cartTotal.innerText = total.toFixed(2);
  }

  cartLogic() {
    cartContent.addEventListener("click", e => {
      if (e.target.classList.contains("remove-item")) {
        let removeItem = e.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeOne(id);
      } else if (e.target.classList.contains("fa-chevron-up")) {
        let cartQty = e.target.nextElementSibling;
        let id = e.target.dataset.id;
        let increase = cart.find(item => item.id == id);
        increase.amount = increase.amount + 1;
        increase.singleTotalPrice = increase.singleTotalPrice + increase.price;
        this.setCartValues(cart);
        Storage.saveCart(cart);
        // Show all item increase total
        cartQty.innerText = increase.amount;
        // Show single Item increase total
        e.target.parentElement.previousElementSibling.children[1].innerText =
          increase.singleTotalPrice;
      } else if (e.target.classList.contains("fa-chevron-down")) {
        let cartQty = e.target.previousElementSibling;
        let id = e.target.dataset.id;
        let decrease = cart.find(item => item.id == id);
        decrease.amount = decrease.amount - 1;
        decrease.singleTotalPrice = decrease.singleTotalPrice - decrease.price;
        if (decrease.amount === 0) {
          cartContent.removeChild(cartQty.parentElement.parentElement);
          this.removeOne(id);
        }
        this.setCartValues(cart);
        Storage.saveCart(cart);
        // Show all item decrease total
        cartQty.innerText = decrease.amount;
        // Show single Item decrease total
        e.target.parentElement.previousElementSibling.children[1].innerText =
          decrease.singleTotalPrice;
      }
    });
  }

  removeOne(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let btnReset = BtnDom.find(btn => btn.dataset.id === id);
    btnReset.innerText = "Add to Cart";
    btnReset.disabled = false;
  }

  populateCart(cart) {
    cart.forEach(item => {
      this.addCartContent(item);
    });
  }

  addCartContent(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5 class="item-price">$${item.singleTotalPrice}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up"  data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down"  data-id=${item.id}></i>
            </div>`;
    cartContent.appendChild(div);
  }
}

// LOCAL STORAGE CLASS
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    const product = products.find(item => item.id === id);
    return product;
    // console.log(product);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

//EVENT LISTENRS
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //Get Initial Values
  ui.setupAPP();

  //Get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
