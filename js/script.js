let count = 0;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded",function(){
    let cartCount = document.getElementById("cart-count");
    if(cartCount){
        cartCount.innerText = cart.length;
    }
});

function addToCart(name, price){

    let existingItem = cart.find(function(item){
        return item.name === name;
    });

    if(existingItem){
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    let cartCount = document.getElementById("cart-count");
    if(cartCount){
        cartCount.innerText = cart.reduce(function(total,item){
            return total + item.quantity;
        },0);
    }
}

if(window.location.pathname.includes("checkout.html")){

    let instantOrder = JSON.parse(localStorage.getItem("instantOrder"));
    if(instantOrder){
        cart = instantOrder;
        localStorage.removeItem("instantOrder");
    }
    let orderContainer = document.getElementById("order-items");
    let totalElement = document.getElementById("total");
    let placeOrderBtn = document.getElementById("place-order");

    function renderCart(){
        orderContainer.innerHTML = "";
        let total = 0;

    

    cart.forEach(function(item,index){
        let div = document.createElement("div");
        div.classList.add("checkout-item");

        let text = document.createElement("span");
        text.innerText = item.name+"x"+item.quantity +"-  ₹" + (item.price*item.quantity);
        let removeBtn = document.createElement("button");
        removeBtn.innerText ="Remove";

        removeBtn.addEventListener("click",function(){
            if(item.quantity >1){
                item.quantity -= 1;
            }else{
                
                cart.splice(index,1);
            }
            localStorage.setItem("cart",JSON.stringify(cart));
            renderCart();
 });
        div.appendChild(text);
        div.appendChild(removeBtn);
        orderContainer.appendChild(div);


        total += item.price*item.quantity;

    });
    totalElement.innerText = total;
    
}
  renderCart();



if(placeOrderBtn){
    placeOrderBtn.addEventListener("click",function(){
        if(cart.length ===0){
            alert("Your cart is empty !!!");
            return;
        }
       let addressInput = document.getElementById("address").value;
       if(addressInput.trim() === ""){
        alert("please enter your address!");
        return;
       }

       localStorage.setItem("lastOrder",JSON.stringify({
        items:cart,
        address:addressInput,
        total: totalElement.innerText
       }));
        cart = [];
        localStorage.removeItem("cart");
        window.location.href ="success.html";

        renderCart();

        let cartCount = document.getElementById("cart-count");
        if(cartCount){
            cartCount.innerText =0;
        }
        setTimeout(function(){
            window.location.href ="index.html";
        },1500);
    });
}
}
function orderNow(name,price){
    let instantOrder = [{name: name,price: price,
        quantity:1
    }];

    localStorage.setItem("instantOrder",JSON.stringify(instantOrder));

    window.location.href ="checkout.html";
}

if(window.location.pathname.includes("feedback.html")){

    let form = document.getElementById("feedback-form");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        let name = document.getElementById("fb-name").value;
        let email = document.getElementById("fb-email").value;
        let rating = document.getElementById("fb-rating").value;
        let message = document.getElementById("fb-message").value;

        let feedbackData = {
            name: name,
            email: email,
            rating: rating,
            message: message
        };

        let allFeedback = JSON.parse(localStorage.getItem("feedback")) || [];
        allFeedback.push(feedbackData);

        localStorage.setItem("feedback", JSON.stringify(allFeedback));

        document.getElementById("feedback-success").innerText =
            "Thank you for your feedback ❤️";

        form.reset();
    });
}