// Foods Array
const fastFoods = [
  { id: 1, image: "burger-1", name: "برگر ساده", price: "199000" },
  {
    id: 2,
    image: "burger-2",
    name: "بیکن برگر",
    price: "225000",
  },
  { id: 3, image: "burger-3", name: "اسپیشیال برگر", price: "238000" },
  {
    id: 4,
    image: "burger-4",
    name: "چیز برگر",
    price: "209000",
  },
  { id: 5, image: "burger-5", name: "مگا ماشروم برگر", price: "265000" },
  { id: 6, image: "burger-6", name: "گریل چیکن برگر", price: "169000" },
  {
    id: 7,
    image: "french-fries-1",
    name: "سیب زمینی سرخ کرده",
    price: "89000",
  },
  {
    id: 8,
    image: "french-fries-2",
    name: "سیب زمینی سرخ کرده مخصوص",
    price: "105000",
  },
  { id: 9, image: "coca-cola", name: "نوشابه کوکاکولا", price: "23000" },
  { id: 10, image: "fanta", name: "نوشابه فانتا", price: "23000" },
];

// CartList
const cartList = [];

// render foods on page load
window.addEventListener("DOMContentLoaded", () => {
  renderFoodsSection(fastFoods);
});

// render foods function
function renderFoodsSection(data) {
  data.forEach((item) => {
    // create food article
    const food = document.createElement("article");
    food.className = "food";
    food.id = `food-${item.id}`;

    // food's image
    const foodImage = document.createElement("img");
    foodImage.src = `assets/images/${item.image}.png`;
    foodImage.alt = `${item.image}`;

    // food's info section
    const foodInfo = document.createElement("section");
    foodInfo.className = "food-info";

    // food's Name
    const foodName = document.createElement("h3");
    foodName.className = "food-name";
    foodName.innerText = `${item.name}`;

    // food's Price
    const foodPrice = document.createElement("p");
    foodPrice.className = "food-price";
    foodPrice.innerText = `${addComma(item.price)} تومان`;

    // food's QTY section
    const foodQty = document.createElement("section");
    foodQty.className = "food-qty";

    // food's increase qty icon
    const foodQtyInc = document.createElement("span");
    foodQtyInc.classList.add("increase-icon", "cursor-pointer", "icon-active");
    foodQtyInc.innerText = "+";
    foodQtyInc.addEventListener("click", (e) => {
      addToCartList(+e.target.closest(".food").id.split("-")[1], fastFoods);
    });
    foodQtyInc.addEventListener("mousedown", (e) => {
      const addInterval = setInterval(() => {
        addToCartList(+e.target.closest(".food").id.split("-")[1], fastFoods);
      }, 200);

      window.addEventListener(
        "mouseup",
        () => {
          clearInterval(addInterval);
        },
        { once: true }
      );
    });

    // food's qty input
    const foodQtyInput = document.createElement("span");
    foodQtyInput.className = "food-qty-input";
    foodQtyInput.id = `food-qty-input-${item.id}`;
    foodQtyInput.innerText = "0";

    // food's decrease qty icon
    const foodQtyDec = document.createElement("span");
    foodQtyDec.classList.add("decrease-icon", "cursor-pointer", "icon-active");
    foodQtyDec.innerText = "-";
    foodQtyDec.addEventListener("click", (e) => {
      removeFromCartList(item.id);
    });
    foodQtyDec.addEventListener("mousedown", (e) => {
      const removeInterval = setInterval(() => {
        removeFromCartList(item.id);
      }, 200);

      window.addEventListener(
        "mouseup",
        () => {
          clearInterval(removeInterval);
        },
        { once: true }
      );
    });

    // total food price
    const foodTotalPrice = document.createElement("p");
    foodTotalPrice.classList.add(
      "food-total-price",
      `food-total-price-${item.id}`
    );
    foodTotalPrice.innerHTML = `<span id="food-total-price-${item.id}">0</span> تومان`;

    // appends
    foodQty.append(foodQtyInc, foodQtyInput, foodQtyDec);
    foodInfo.append(foodName, foodPrice, foodQty);
    food.append(foodImage, foodInfo, foodTotalPrice);
    foodsSection.append(food);
  });
}

// add to cart function
function addToCartList(productId, productList) {
  const foundedProduct = productList.find((item) => item.id === productId);

  const productInCartIndex = cartList.findIndex(
    (item) => item.id === productId
  );

  if (productInCartIndex === -1) {
    // Product does not exist in Cart
    cartList.push({ ...foundedProduct, qty: 1 });
  } else {
    // Product does exist in Cart
    cartList[productInCartIndex].qty++;
  }
  updateProductQty(productId);
  changeProductTotalPrice(productId);
  updateCart();
}

// update product Quantity
function updateProductQty(id) {
  cartList.forEach((item) => {
    let total = 0;
    total += item.qty;
    const pTotalQty = document.getElementById(`food-qty-input-${id}`);
    pTotalQty.innerText = total;
  });
}

// change product total price
function changeProductTotalPrice(id) {
  cartList.forEach((item) => {
    let total = 0;
    let totalPrice = 0;
    total += item.qty;
    totalPrice += item.qty * parseInt(item.price);
    const pTotalPrice = document.getElementById(`food-total-price-${id}`);
    pTotalPrice.innerText = addComma(totalPrice);
  });
}

// Update cart
function updateCart() {
  changeServicePrice();
  changeSubTotalPrice();
  changeTotalPrice();
}

// change service price
function changeServicePrice() {
  let total = 0;
  let totalPrice = 0;

  cartList.forEach((item) => {
    total += item.qty;
    totalPrice += item.qty * parseInt(item.price);
  });

  const serviceCost = totalPrice * 0.09 + 1200;

  const ServicePriceElement = document.getElementById("check-out-service");
  ServicePriceElement.innerText = addComma(serviceCost);
}

// change sub total price
function changeSubTotalPrice() {
  let total = 0;
  let totalPrice = 0;

  cartList.forEach((item) => {
    total += item.qty;
    totalPrice += item.qty * parseInt(item.price);
  });

  const totalPriceElement = document.getElementById("check-out-sum");
  totalPriceElement.innerText = addComma(totalPrice);
}

// change cart total price
let discount = 0;
function changeTotalPrice() {
  let total = 0;
  let subTotalPrice = 0;
  let totalPrice = 0;

  cartList.forEach((item) => {
    total += item.qty;
    subTotalPrice += item.qty * parseInt(item.price);
  });

  const serviceCost = subTotalPrice * 0.09 + 1200;

  if (discount) {
    totalPrice = subTotalPrice + serviceCost - discount;
  } else {
    if (subTotalPrice === 0) {
      totalPrice = subTotalPrice;
    } else {
      totalPrice = subTotalPrice + serviceCost;
    }
  }

  const ServicePriceElement = document.getElementById("check-out-total");
  ServicePriceElement.innerText = addComma(totalPrice);
  if (totalPrice < 0) {
    ServicePriceElement.innerText = 0;
  }
}

// remove from cart
function removeFromCartList(productId) {
  const foundedProductInCart = cartList.find((item) => item.id === productId);

  const productInCartIndex = cartList.findIndex(
    (item) => item.id === productId
  );

  if (foundedProductInCart.qty === 0) {
    // Product does not exist in Cart
    cartList.splice(productInCartIndex, 1);
  } else {
    // Product does exist in Cart
    cartList[productInCartIndex].qty--;
  }
  updateProductQty(productId);
  changeProductTotalPrice(productId);
  updateCart();
}

// handle discount
const discountClick = document.querySelector(".discount-input-icon");

const discountCodes = [
  { discountCode: "discount5", discountValue: 5000 },
  { discountCode: "discount10", discountValue: 10000 },
  { discountCode: "discount20", discountValue: 20000 },
  { discountCode: "discount30", discountValue: 30000 },
];

discountClick.addEventListener("click", handleDiscount);

function handleDiscount() {
  const discountInput = document.getElementById("discount");
  const checkOutDiscount = document.getElementById("check-out-discount");
  const discountFound = discountCodes.find((item) => {
    return item.discountCode === discountInput.value;
  });

  if (discountFound) {
    discount = discountFound.discountValue;
    checkOutDiscount.innerText = addComma(discount);
    updateCart();
  } else {
    // FIXME
    toggleDiscountAnimation();
    discountInput.value = "کد نامعتبر!";
  }
}

function toggleDiscountAnimation() {
  const discountSec = document.querySelector(".discount-input");
  discountSec.classList.toggle("animate__animated");
  discountSec.classList.toggle("animate__headShake");
}
