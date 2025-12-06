const FREE_DELIVERY_THRESHOLD = 1200;

let cart = [];
const cartBtn = document.getElementById('openCart');
const cartCount = document.getElementById('cartCount');
const chooseLocation = document.getElementById('chooseLocation');
const grid = document.getElementById('cardGrid');
const filters = document.querySelectorAll('.pill');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const contactForm = document.getElementById('contactForm');
const newsForm = document.getElementById('newsForm');

function formatPKR(n){return 'Rs. ' + n}
function calcTotal(){let t=0;for(let i=0;i<cart.length;i++){t+=cart[i].price}return t}
function syncCount(){cartCount.textContent=cart.length}
function addToCart(item,price){const it={id:Date.now(),name:item,price:price,qty:1};cart.push(it);syncCount();const total=calcTotal();if(total>=FREE_DELIVERY_THRESHOLD){alert(item+' added. '+formatPKR(total)+' total. Free delivery unlocked!')}else{alert(item+' added. Total: '+formatPKR(total))}}
function filterCards(type){const cards=[...grid.querySelectorAll('.card')];cards.forEach(c=>{if(type==='all'||c.dataset.type===type){c.style.display='block'}else{c.style.display='none'}})}
function handleSearch(q){const term=q.toLowerCase().trim();const cards=[...grid.querySelectorAll('.card')];let hits=0;cards.forEach(c=>{const name=c.dataset.name.toLowerCase();if(name.includes(term)){c.style.display='block';hits++}else{c.style.display='none'}});if(term!==''&&hits===0){alert('No results for "'+q+'". Try another search.')}}

grid.addEventListener('click',e=>{const btn=e.target.closest('.add');if(!btn)return;const card=btn.closest('.card');const name=card.dataset.name;const price=parseInt(card.dataset.price,10);addToCart(name,price)});
filters.forEach(p=>p.addEventListener('click',()=>{filters.forEach(f=>f.classList.remove('active'));p.classList.add('active');filterCards(p.dataset.filter)}));
chooseLocation.addEventListener('click',()=>{const city=prompt('Enter your city or area');if(city&&city.trim().length>0){alert('Location set to '+city+'. Showing restaurants near you.')}else{alert('Location not changed')}});

searchForm.addEventListener('submit',e=>{e.preventDefault();handleSearch(searchInput.value)});
contactForm.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('cName').value;const email=document.getElementById('cEmail').value;const msg=document.getElementById('cMsg').value;if(name&&email&&msg){alert('Thanks, '+name+'! We will reply at '+email)}else{alert('Please fill all fields')}});
newsForm.addEventListener('submit',e=>{e.preventDefault();const em=document.getElementById('newsEmail').value;if(em){alert('Subscribed: '+em)}else{alert('Enter email to subscribe')}});

const observer=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){en.target.style.animationDelay=Math.random()*0.25+'s';en.target.classList.add('in');}})},{threshold:.15});
document.querySelectorAll('.card').forEach(c=>observer.observe(c));

const drawer=document.createElement('div');
drawer.className='cart-drawer';
drawer.innerHTML=`
  <div class="cart-head">
    <h3>Your Cart</h3>
    <button id="closeCart" class="icon">close</button>
  </div>
  <div id="cartItems" class="cart-items"></div>
  <div class="cart-foot">
    <div class="row"><span>Total</span><strong id="cartTotal">Rs. 0</strong></div>
    <button id="checkout" class="checkout">Checkout</button>
  </div>
`;
document.body.appendChild(drawer);

function renderCart(){
  const box=document.getElementById('cartItems');
  const totalEl=document.getElementById('cartTotal');
  box.innerHTML='';
  if(cart.length===0){box.innerHTML='<p class="empty">Your cart is empty</p>'}
  cart.forEach((it,idx)=>{
    const row=document.createElement('div');
    row.className='cart-row';
    row.innerHTML=`
      <div class="name">${it.name}</div>
      <div class="price">${formatPKR(it.price)}</div>
      <button class="remove" data-idx="${idx}">Remove</button>
    `;
    box.appendChild(row);
  });
  totalEl.textContent=formatPKR(calcTotal());
}

function openCart(){drawer.classList.add('show');renderCart()}
function closeCart(){drawer.classList.remove('show')}

cartBtn.addEventListener('click',openCart);
document.addEventListener('click',e=>{if(e.target.id==='closeCart')closeCart();if(e.target.classList.contains('remove')){const i=parseInt(e.target.dataset.idx,10);cart.splice(i,1);syncCount();renderCart()}if(e.target.id==='checkout'){const total=calcTotal();if(total===0){alert('Add items before checkout')}else{if(total>=FREE_DELIVERY_THRESHOLD){alert('Order placed with free delivery! Total: '+formatPKR(total))}else{alert('Order placed. Delivery calculated at checkout. Total: '+formatPKR(total))}cart=[];syncCount();renderCart();closeCart()}}});

const style=document.createElement('style');
style.textContent=`
.cart-drawer{position:fixed;top:0;right:-420px;width:min(400px,92%);height:100dvh;background:#fff;border-left:1px solid #eee;box-shadow:-8px 0 24px rgba(0,0,0,.08);z-index:80;display:flex;flex-direction:column;transition:right .35s ease}
.cart-drawer.show{right:0}
.cart-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid #f1f1f4}
.cart-head h3{margin:0}
.cart-head .icon{border:none;background:#fff;border-radius:10px;padding:8px 10px;cursor:pointer}
.cart-items{flex:1;overflow:auto;padding:10px 14px}
.cart-row{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;border-bottom:1px dashed #eee;padding:10px 6px}
.cart-row .remove{background:#f43f5e;color:#fff;border:none;border-radius:10px;padding:8px 10px;cursor:pointer}
.cart-foot{border-top:1px solid #f1f1f4;padding:14px}
.cart-foot .row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.checkout{width:100%;background:var(--pink);color:#fff;border:none;border-radius:12px;padding:12px 14px;font-weight:700;cursor:pointer}
.checkout:hover{background:var(--pink-dark)}
.empty{color:#6b7280;text-align:center;padding:30px 0}
`;
document.head.appendChild(style);
