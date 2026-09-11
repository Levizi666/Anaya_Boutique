if (localStorage.getItem("anaya_catalog_version") !== CATALOG_VERSION) {
  localStorage.removeItem("anaya_cart");
  localStorage.setItem("anaya_catalog_version", CATALOG_VERSION);
}

let cart = JSON.parse(localStorage.getItem("anaya_cart") || "[]");

const money = n => (typeof n === "number" && Number.isFinite(n)) ? new Intl.NumberFormat("fr-FR").format(n) + " FCFA" : "Prix sur demande";

function saveCart(){ localStorage.setItem("anaya_cart", JSON.stringify(cart)); renderCart(); }

function productCard(p){
  const image = p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : `<div class="placeholder">${p.icon}</div>`;
  const price = money(p.price);
  const buyLabel = (typeof p.price === "number") ? "Ajouter" : "Demander le prix";
  return `<article class="product-card">
    ${p.badge ? `<span class="badge ${p.badge==='Promo'?'sale':''}">${p.badge}</span>` : ""}
    <div class="product-img">${image}</div>
    <div class="product-info">
      <small>${p.category}</small>
      <h3>${p.name}</h3>
      <div><span class="price">${price}</span>${p.old?`<span class="old">${money(p.old)}</span>`:""}</div>
      <div class="product-variants"><span>Tailles du ${p.sizes[0]} au ${p.sizes.at(-1)}</span><div class="color-preview">${p.colors.map(c=>`<i title="${c.name}" style="--color:${c.hex}"></i>`).join("")}</div></div>
      <div class="product-actions">
        <button class="details" onclick="showProduct(${p.id})">Voir</button>
        <button class="buy" onclick="showProduct(${p.id})">${buyLabel}</button>
      </div>
    </div>
  </article>`;
}

function renderProducts(){
  let list=[...PRODUCTS];
  const q=(document.getElementById("searchInput").value||"").toLowerCase().trim();
  const cat=document.getElementById("categoryFilter").value;
  const sort=document.getElementById("sortFilter").value;
  if(q) list=list.filter(p=>(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(q));
  if(cat!=="all") list=list.filter(p=>p.category===cat);
  if(sort==="priceAsc") list.sort((a,b)=>(a.price ?? Infinity)-(b.price ?? Infinity));
  if(sort==="priceDesc") list.sort((a,b)=>(b.price ?? -Infinity)-(a.price ?? -Infinity));
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById("catalogueProducts").innerHTML=list.map(productCard).join("");
  document.getElementById("emptyState").hidden=list.length!==0;
  document.getElementById("featuredProducts").innerHTML=PRODUCTS.slice(0,6).map(productCard).join("");
}

function addToCart(id, selection={}){
  const p=PRODUCTS.find(x=>x.id===id);
  if(typeof p.price !== "number"){
    const details = selection.size && selection.color ? ` Taille : ${selection.size}. Couleur : ${selection.color}.` : "";
    const msg = `Bonjour ANAYA, je souhaite connaître le prix du produit : ${p.name}.${details}`;
    window.open(`https://wa.me/22396966666?text=${encodeURIComponent(msg)}`,"_blank");
    return;
  }
  const found=cart.find(x=>x.id===id&&x.selectedSize===selection.size&&x.selectedColor===selection.color);
  if(found) found.qty++;
  else cart.push({...p,selectedSize:selection.size||"",selectedColor:selection.color||"",qty:1});
  saveCart();
  openCart();
}

function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const el=document.getElementById("cartItems");
  if(!cart.length){el.innerHTML='<div style="padding:45px 10px;text-align:center;color:#888">Votre panier est vide.<br><br>Ajoutez vos articles préférés ♥</div>'}
  else el.innerHTML=cart.map(x=>`<div class="cart-item">
    <div class="thumb">${x.image ? `<img src="${x.image}" alt="${x.name}">` : x.icon}</div>
    <div><h4>${x.name}</h4><small>${money(x.price)}</small>${x.selectedSize?`<small class="cart-variant">${x.selectedSize} · ${x.selectedColor}</small>`:""}
      <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${x.id},1)">+</button></div>
    </div>
    <button class="remove" onclick="removeItem(${x.id})">×</button>
  </div>`).join("");
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+(typeof x.price==="number"?x.price*x.qty:0),0));
}
function changeQty(id,n){const x=cart.find(i=>i.id===id); if(!x)return; x.qty+=n;if(x.qty<=0)removeItem(id);else saveCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

function showProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  const photo = p.image ? `<img src="${p.image}" alt="${p.name}">` : p.icon;
  const action = typeof p.price === "number"
    ? `<button class="btn primary" onclick="submitSelection(${p.id}, true)">Ajouter au panier</button>`
    : `<button class="btn primary" onclick="submitSelection(${p.id}, false)">Demander le prix sur WhatsApp</button>`;
  document.getElementById("modalContent").innerHTML=`<div class="modal-content">
    <div class="modal-photo">${photo}</div><div class="modal-info">
      <small>${p.category}</small><h2>${p.name}</h2><p>${p.desc}</p>
      <div class="modal-price">${money(p.price)}</div>
      <div class="variant-picker">
        <div class="variant-title"><span>Choisissez la taille</span><b id="selectedSize">${p.sizes[0]}</b></div>
        <div class="size-options">${p.sizes.map((size,index)=>`<button class="size-option ${index===0?"selected":""}" data-size="${size}" onclick="selectVariant(this, 'size')">${size}</button>`).join("")}</div>
        <div class="variant-title"><span>Choisissez la couleur</span><b id="selectedColor">${p.colors[0].name}</b></div>
        <div class="color-options">${p.colors.map((color,index)=>`<button class="color-option ${index===0?"selected":""}" data-color="${color.name}" onclick="selectVariant(this, 'color')"><i style="--color:${color.hex}"></i>${color.name}</button>`).join("")}</div>
      </div>
      ${action}
    </div></div>`;
  document.getElementById("productModal").classList.add("show");
}

function selectVariant(button, type){
  const optionClass = type === "size" ? ".size-option" : ".color-option";
  button.parentElement.querySelectorAll(optionClass).forEach(option=>option.classList.remove("selected"));
  button.classList.add("selected");
  document.getElementById(type === "size" ? "selectedSize" : "selectedColor").textContent = button.dataset[type];
}

function submitSelection(id, addToBasket){
  const selection = {size:document.getElementById("selectedSize").textContent, color:document.getElementById("selectedColor").textContent};
  addToCart(id, selection);
  if(addToBasket) document.getElementById("productModal").classList.remove("show");
}
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("categoryFilter").addEventListener("change",renderProducts);
document.getElementById("sortFilter").addEventListener("change",renderProducts);
document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{
  document.getElementById("categoryFilter").value=b.dataset.category;
  document.getElementById("catalogue").scrollIntoView({behavior:"smooth"});
  renderProducts();
}));
document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("modalClose").onclick=()=>document.getElementById("productModal").classList.remove("show");
document.getElementById("clearCart").onclick=()=>{cart=[];saveCart()};
document.getElementById("whatsappOrder").onclick=()=>{
  if(!cart.length){alert("Votre panier est vide.");return}
  const lines=cart.map(x=>`• ${x.name} x${x.qty} — ${money(x.price*x.qty)}`).join("%0A");
  const total=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  window.open(`https://wa.me/22396966666?text=Bonjour%20ANAYA%2C%20je%20souhaite%20commander%20%3A%0A${lines}%0A%0ATotal%20%3A%20${encodeURIComponent(total)}`,"_blank");
};
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("contactName").value;
  const msg=document.getElementById("contactMessage").value;
  const url=`https://wa.me/22396966666?text=${encodeURIComponent("Bonjour ANAYA, je suis "+name+". "+msg)}`;
  document.getElementById("contactNotice").textContent="Message prêt : ouverture de WhatsApp…";
  window.open(url,"_blank");
});
const themeToggle=document.getElementById("themeToggle");
const savedTheme=localStorage.getItem("anaya_theme");
if(savedTheme==="dark"){
  document.body.classList.add("dark-mode");
  if(themeToggle){themeToggle.textContent="☀";themeToggle.title="Mode clair";}
}
if(themeToggle) themeToggle.onclick=()=>{
  document.body.classList.toggle("dark-mode");
  const dark=document.body.classList.contains("dark-mode");
  localStorage.setItem("anaya_theme",dark?"dark":"light");
  themeToggle.textContent=dark?"☀":"☾";
  themeToggle.title=dark?"Mode clair":"Mode sombre";
};
document.getElementById("mobileMenu").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
document.getElementById("accountBtn").onclick=()=>alert("Espace client : à connecter à un backend PHP/MySQL pour les comptes, commandes et historique.");

renderProducts(); renderCart();
