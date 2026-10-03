import { createBrowserCart } from './browser';
import { quoteCart, type CartItem, type CommerceProduct } from './index';
import { formatMoney } from '../utils/format';
import { validIndianPhone, type Customer } from '../whatsapp/order';
import { site } from '../../data/site';

const products: CommerceProduct[] = JSON.parse(document.querySelector('#commerce-catalog')?.textContent ?? '[]');
const summaries = document.querySelectorAll<HTMLElement>('[data-cart-content]');
const checkout = document.querySelector<HTMLFormElement>('[data-checkout]');
const drawer = document.querySelector<HTMLDialogElement>('[data-cart-drawer]');
const announcement = document.querySelector<HTMLElement>('[data-cart-announcement]');
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className?: string): HTMLElementTagNameMap[K] => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
let current: CartItem[] = [];
let storageError: string | null = null;
let returnFocus: HTMLElement | null = null;

function openDrawer(trigger: HTMLElement | null) {
  if (!drawer || drawer.open) return;
  returnFocus = trigger; drawer.showModal(); document.documentElement.classList.add('drawer-open');
}
function closeDrawer() { drawer?.close(); }
drawer?.addEventListener('close', () => { document.documentElement.classList.remove('drawer-open'); returnFocus?.focus(); });
drawer?.addEventListener('click', (event) => { if (event.target !== drawer) return; const r = drawer.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDrawer(); });
document.querySelector('[data-close-cart]')?.addEventListener('click', closeDrawer);
document.querySelectorAll<HTMLAnchorElement>('[data-open-cart]').forEach(trigger => trigger.addEventListener('click', event => { event.preventDefault(); document.querySelectorAll<HTMLDetailsElement>('header details[open]').forEach(d=>d.open=false); openDrawer(trigger); }));
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  if (!target?.closest('header details')) {
    document.querySelectorAll<HTMLDetailsElement>('header details[open]').forEach(d => { d.open = false; });
  }
});
const store = createBrowserCart((items, error) => { current = items; storageError = error; render(); });

function render() {
  const count = current.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelectorAll<HTMLElement>('.cart-badge[data-cart-count]').forEach(el => {
    el.textContent = count > 0 ? String(count) : '';
    el.hidden = count === 0;
  });
  document.querySelectorAll<HTMLElement>('h2 [data-cart-count]').forEach(el => {
    el.textContent = String(count);
  });
  document.querySelectorAll('[data-open-cart]').forEach(el => el.setAttribute('aria-label',`Open shopping bag, ${count} ${count===1?'item':'items'}`));
  const quote = quoteCart(current,products);
  const active = document.activeElement as HTMLElement | null;
  const focusKey = active?.dataset.controlKey;
  const focusParent = active?.closest<HTMLElement>('[data-cart-content]')?.dataset.cartContent;
  
  summaries.forEach(summary => {
    summary.replaceChildren();
    if (storageError) summary.append(node('p',storageError,'notice'));
    if (!current.length) {
      const empty=node('div','','empty-cart'); empty.append(node('span','Your next pantry pick awaits.','empty-cart-title'),node('p','Explore the catalog and add something you like.'));
      const link=node('a','Explore the shop','button'); link.href='/shop/'; empty.append(link); summary.append(empty); return;
    }
    const rows=node('div','','cart-items');
    current.forEach(item => {
      const product=products.find(p=>p.id===item.productId);
      const line=quote.lines.find(l=>l.productId===item.productId && l.variantId===item.variantId);
      const name=product?.name ?? 'Product no longer listed';
      const row=node('article','','cart-row'); const imageSlot=node('div','','cart-thumbnail');
      const image=node('img'); image.src=product?.thumbnail?.src ?? site.business.logo!; image.alt=product?.thumbnail?.alt ?? 'Fit Monk — product photography pending'; image.width=88; image.height=88; image.loading='lazy'; imageSlot.append(image);
      const details=node('div','','cart-item-details');
      if(product){ const link=node('a',name,'cart-item-name'); link.href=`/product/${product.slug}/`; details.append(link); } else details.append(node('span',name));
      details.append(node('p',line ? `${line.pack ?? 'Pack unconfirmed'} · ${formatMoney(line.unitPrice)} each`:'Selection needs confirmation. Please remove it to continue.','cart-item-pack'));
      const controls=node('div','','quantity-controls');
      for(const [action,value] of [['Decrease',item.quantity-1],['Increase',item.quantity+1]] as const){
        const button=node('button',action==='Decrease'?'−':'+'); button.type='button'; button.setAttribute('aria-label',`${action} ${name}`); button.disabled=value>99;
        button.dataset.controlKey=`${item.productId}:${item.variantId}:${action}`;
        button.addEventListener('click',()=>{ store.setQuantity(item,value); if(announcement) announcement.textContent=`${name}: ${value===0?'removed':`quantity ${value}`}.`; });
        controls.append(button); if(action==='Decrease') controls.append(node('span',String(item.quantity)));
      }
      const remove=node('button','Remove','remove-item'); remove.type='button'; remove.setAttribute('aria-label',`Remove ${name}`); remove.addEventListener('click',()=>{store.setQuantity(item,0);if(announcement) announcement.textContent=`${name} removed from your bag.`;});
      details.append(controls,remove); row.append(imageSlot,details);
      const price=node('div','','cart-line-price'); if(line){price.append(node('strong',formatMoney(line.lineTotal)));if(line.discount) price.append(node('small',`Saved ${formatMoney(line.discount)}`));}row.append(price);rows.append(row);
    });
    const totals=node('div','','cart-totals');
    const totalRow=(label:string,value:string,important=false)=>{const row=node('p','',important?'total-row grand-total':'total-row');row.append(node('span',label),node('strong',value));return row;};
    totals.append(totalRow(quote.issues.length?'Priced items subtotal':'Subtotal',formatMoney(quote.subtotal)),totalRow('Shipping',quote.shipping===null?'To be confirmed':formatMoney(quote.shipping)));
    if(quote.grandTotal!==null) totals.append(totalRow('Grand total',formatMoney(quote.grandTotal),true));
    else totals.append(node('p','Shipping to be confirmed. The seller will confirm the final total.','shipping-note'));
    quote.issues.forEach(issue=>totals.append(node('p',issue,'notice')));
    if(summary.dataset.cartContent!=='checkout' && !quote.issues.length){const cta=node('a','Continue to checkout →','button');cta.href='/checkout/';totals.append(cta);}
    if(summary.dataset.cartContent==='drawer'){const link=node('a','View full cart','text-link');link.href='/cart/';totals.append(link);}
    totals.append(node('p','Confirmed personally on WhatsApp.','order-reassurance'));
    summary.append(rows,totals);
  });
  if(focusKey && focusParent){const container=[...summaries].find(s=>s.dataset.cartContent===focusParent);const target=[...container?.querySelectorAll<HTMLElement>('[data-control-key]')??[]].find(el=>el.dataset.controlKey===focusKey);target?.focus();}
  
  // Checkout in-step review & sticky bar sync
  updateCheckoutReview(quote);
  
  const submit=document.querySelector<HTMLButtonElement>('[data-checkout-submit]'); 
  if(submit) submit.disabled=!quote.lines.length || !!quote.issues.length;
  const preview=document.querySelector<HTMLDetailsElement>('[data-message-preview]'); 
  if(preview) preview.hidden=true;
}

function updateCheckoutReview(quote: ReturnType<typeof quoteCart>) {
  const itemsContainer = document.querySelector<HTMLElement>('[data-review-items]');
  if (itemsContainer) {
    itemsContainer.replaceChildren();
    if (!quote.lines.length) {
      itemsContainer.append(node('p', 'Your cart is empty. Please add items to order.', 'muted'));
    } else {
      quote.lines.forEach(l => {
        const row = node('div', '', 'compact-review-row');
        const desc = node('span', `${l.name}${l.pack ? ` · ${l.pack}` : ''} × ${l.quantity}`, 'compact-row-name');
        const price = node('strong', formatMoney(l.lineTotal), 'compact-row-price');
        row.append(desc, price);
        itemsContainer.append(row);
      });
    }
  }

  const subtotalEl = document.querySelector<HTMLElement>('[data-review-subtotal]');
  if (subtotalEl) subtotalEl.textContent = formatMoney(quote.subtotal);

  const shippingEl = document.querySelector<HTMLElement>('[data-review-shipping]');
  if (shippingEl) shippingEl.textContent = quote.shipping === null ? 'To be confirmed' : (quote.shipping === 0 ? 'FREE' : formatMoney(quote.shipping));

  const totalEl = document.querySelector<HTMLElement>('[data-review-total]');
  if (totalEl) totalEl.textContent = quote.grandTotal !== null ? formatMoney(quote.grandTotal) : formatMoney(quote.subtotal);

  const stickyTotal = document.querySelector<HTMLElement>('[data-sticky-total]');
  if (stickyTotal) stickyTotal.textContent = quote.grandTotal !== null ? formatMoney(quote.grandTotal) : formatMoney(quote.subtotal);

  const mobileBar = document.querySelector<HTMLElement>('#checkout-mobile-bar');
  if (mobileBar) mobileBar.hidden = !quote.lines.length;
}

// Product catalog purchase forms
document.querySelectorAll<HTMLFormElement>('[data-purchase]').forEach(form=>{
  const p=products.find(p=>p.id===form.dataset.purchase);if(!p)return;
  const select=form.querySelector<HTMLSelectElement>('select');const selected=()=>p.variants.find(v=>v.id===select?.value)??p;
  select?.addEventListener('change',()=>{
    const v=selected();form.querySelector('[data-price]')!.textContent=v.price===null?'Price to be confirmed':formatMoney(v.price);
    const compare=form.querySelector<HTMLElement>('[data-compare]')!;compare.textContent=v.compareAtPrice===null?'':formatMoney(v.compareAtPrice);compare.hidden=v.price===null||v.compareAtPrice===null||v.compareAtPrice<=v.price;
    const discount=form.querySelector<HTMLElement>('[data-discount]');if(discount){discount.hidden=compare.hidden;discount.textContent=v.price!==null&&v.compareAtPrice!==null?`Save ${formatMoney(v.compareAtPrice-v.price)}`:'';}
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type=submit]');
    if (submitBtn) {
      const isAvailable = p.orderable && v.price !== null && v.available !== false;
      submitBtn.disabled = !isAvailable;
      submitBtn.classList.toggle('button-add-cart', isAvailable);
      submitBtn.classList.toggle('button-confirm', !isAvailable);
      const span = submitBtn.querySelector('span');
      if (span) span.textContent = isAvailable ? 'Add to Cart' : 'Price to be confirmed';
    }
    form.querySelector('[data-purchase-status]')!.textContent='';
  });
  form.querySelectorAll<HTMLButtonElement>('[data-adjust]').forEach(button=>button.addEventListener('click',()=>{const input=form.querySelector<HTMLInputElement>('[name=quantity]')!;input.value=String(Math.max(1,Math.min(99,(Number(input.value)||1)+Number(button.dataset.adjust))));}));
  form.addEventListener('submit',event=>{
    event.preventDefault();const status=form.querySelector('[data-purchase-status]')!;
    try{
      const v=selected();if(!p.orderable||v.price===null||v.available===false)throw new Error('Please confirm this selection with the seller.');
      store.add({productId:p.id,variantId:select?.value??null,quantity:Number(form.querySelector<HTMLInputElement>('[name=quantity]')?.value??1)});
      status.textContent=storageError??'✓ Added to your bag';if(announcement)announcement.textContent=storageError??`${p.name} added to your bag.`;
      if(!storageError)openDrawer(form.querySelector('button[type=submit]'));
    }catch(error){status.textContent=error instanceof Error?error.message:'Unable to add item.';}
  });
});

// Direct Buy on WhatsApp handler from Product Detail Page
document.querySelectorAll<HTMLButtonElement>('[data-buy-whatsapp-direct]').forEach(button => {
  button.addEventListener('click', async () => {
    const buyPanel = button.closest('.product-buy-panel');
    const form = buyPanel?.querySelector<HTMLFormElement>('form[data-purchase]') || document.querySelector<HTMLFormElement>('form[data-purchase]');
    const productId = form?.dataset.purchase;
    if (!productId) return;

    const select = form.querySelector<HTMLSelectElement>('select[name="variant"]');
    const qtyInput = form.querySelector<HTMLInputElement>('input[name="quantity"]');
    const quantity = Math.max(1, Math.min(99, Number(qtyInput?.value) || 1));
    const variantId = select?.value || null;
    const statusEl = form.querySelector<HTMLElement>('[data-purchase-status]');

    // Prevent duplicate draft creation
    if (button.disabled) return;
    button.disabled = true;

    const span = button.querySelector('span');
    const originalText = span ? span.textContent : button.textContent;
    if (span) span.textContent = 'Preparing Order...';
    if (statusEl) {
      statusEl.textContent = 'Preparing your order…';
      statusEl.className = 'status';
    }

    try {
      const res = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          quantity
        })
      });

      const data = await res.json() as any;

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Couldn't prepare your order. Please try again.");
      }

      if (statusEl) {
        statusEl.textContent = `✓ Order ${data.orderNumber} prepared! Opening WhatsApp…`;
        statusEl.className = 'status success';
      }

      // Open WhatsApp immediately
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');

      // Reset button after short delay to allow retry if window blocked
      setTimeout(() => {
        if (span) span.textContent = originalText;
        button.disabled = false;
      }, 2500);
    } catch (err: any) {
      const errMsg = err?.message || "Couldn't prepare your order. Please try again.";
      if (statusEl) {
        statusEl.textContent = errMsg;
        statusEl.className = 'status error';
      }
      if (span) span.textContent = "Couldn't prepare your order. Please try again.";
      setTimeout(() => {
        if (span) span.textContent = originalText;
        button.disabled = false;
      }, 3000);
    }
  });
});

// PROGRESSIVE 3-STEP CHECKOUT LOGIC
function initCheckoutProgressive() {
  if (!checkout) return;

  const nameInput = checkout.querySelector<HTMLInputElement>('[name="name"]')!;
  const phoneInput = checkout.querySelector<HTMLInputElement>('[name="phone"]')!;
  const pinInput = checkout.querySelector<HTMLInputElement>('[name="pinCode"]')!;
  const cityInput = checkout.querySelector<HTMLInputElement>('[name="city"]')!;
  const stateInput = checkout.querySelector<HTMLInputElement>('[name="state"]')!;
  const addressInput = checkout.querySelector<HTMLTextAreaElement>('[name="address"]')!;
  const apartmentInput = checkout.querySelector<HTMLInputElement>('[name="apartment"]');
  const noteInput = checkout.querySelector<HTMLTextAreaElement>('[name="note"]');
  const pinLoading = checkout.querySelector<HTMLElement>('[data-pin-loading]');
  const pinHint = checkout.querySelector<HTMLElement>('[data-pin-hint]');
  const stickyAction = document.querySelector<HTMLButtonElement>('[data-sticky-action]');
  const submitBtn = checkout.querySelector<HTMLButtonElement>('[data-checkout-submit]');
  const detectedRow = checkout.querySelector<HTMLElement>('[data-pin-detected-row]');
  const detectedText = checkout.querySelector<HTMLElement>('[data-detected-location-text]');
  const editLocationBtn = checkout.querySelector<HTMLButtonElement>('[data-edit-location]');
  const cityStateRow = checkout.querySelector<HTMLElement>('[data-city-state-row]');

  let activeStep: 1 | 2 | 3 = 1;

  function showError(fieldName: string, message: string) {
    const err = checkout!.querySelector<HTMLElement>(`[data-error="${fieldName}"]`);
    if (err) { err.textContent = message; err.hidden = false; }
    const input = checkout!.querySelector<HTMLElement>(`[name="${fieldName}"]`);
    input?.classList.add('input-error');
  }

  function clearError(fieldName: string) {
    const err = checkout!.querySelector<HTMLElement>(`[data-error="${fieldName}"]`);
    if (err) err.hidden = true;
    const input = checkout!.querySelector<HTMLElement>(`[name="${fieldName}"]`);
    input?.classList.remove('input-error');
  }

  // Clear errors on input
  nameInput?.addEventListener('input', () => clearError('name'));
  phoneInput?.addEventListener('input', () => clearError('phone'));
  pinInput?.addEventListener('input', () => clearError('pinCode'));
  cityInput?.addEventListener('input', () => clearError('city'));
  stateInput?.addEventListener('input', () => clearError('state'));
  addressInput?.addEventListener('input', () => clearError('address'));

  // Edit location button uncollapses City/State inputs
  editLocationBtn?.addEventListener('click', () => {
    if (cityStateRow) cityStateRow.hidden = false;
    if (detectedRow) detectedRow.hidden = true;
    cityInput?.focus();
  });

  // PIN Code Auto-Detection via India Post API
  let lastPin = '';
  pinInput?.addEventListener('input', () => {
    const cleanPin = pinInput.value.replace(/\D/g, '').slice(0, 6);
    pinInput.value = cleanPin;
    if (cleanPin.length < 6) {
      if (detectedRow) detectedRow.hidden = true;
      if (pinHint) pinHint.textContent = 'City and State auto-fill after entering 6 digits.';
      return;
    }
    if (cleanPin === lastPin) return;
    lastPin = cleanPin;

    if (!/^[1-9]\d{5}$/.test(cleanPin)) {
      showError('pinCode', 'Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    clearError('pinCode');
    if (pinLoading) pinLoading.hidden = false;
    if (pinHint) pinHint.textContent = 'Detecting city & state…';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        if (pinLoading) pinLoading.hidden = true;
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Circle || po.Name || '';
          const detectedState = po.State || '';
          if (detectedCity) { cityInput.value = detectedCity; clearError('city'); }
          if (detectedState) { stateInput.value = detectedState; clearError('state'); }
          if (detectedCity && detectedState) {
            if (detectedText) detectedText.textContent = `${detectedCity} · ${detectedState}`;
            if (detectedRow) detectedRow.hidden = false;
            if (cityStateRow) cityStateRow.hidden = true;
          }
          if (pinHint) {
            pinHint.textContent = `✓ Auto-filled: ${detectedCity}, ${detectedState}`;
            pinHint.classList.add('detected');
          }
        } else {
          if (cityStateRow) cityStateRow.hidden = false;
          if (detectedRow) detectedRow.hidden = true;
          if (pinHint) pinHint.textContent = 'PIN lookup unavailable. You can enter City & State manually.';
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        if (pinLoading) pinLoading.hidden = true;
        if (cityStateRow) cityStateRow.hidden = false;
        if (detectedRow) detectedRow.hidden = true;
        if (pinHint) pinHint.textContent = 'Enter City & State below if not auto-filled.';
      });
  });

  // Optional disclosure toggles
  checkout.querySelectorAll<HTMLButtonElement>('[data-toggle-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetName = trigger.dataset.toggleTrigger;
      const target = checkout!.querySelector<HTMLElement>(`[data-toggle-target="${targetName}"]`);
      if (target) {
        target.hidden = false;
        trigger.hidden = true;
        const input = target.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
        input?.focus();
      }
    });
  });

  function goToStep(step: 1 | 2 | 3) {
    activeStep = step;

    const progressFill = document.querySelector<HTMLElement>('[data-progress-fill]');
    const stepNumText = document.querySelector<HTMLElement>('[data-step-indicator-num]');
    const stepTitleText = document.querySelector<HTMLElement>('[data-step-indicator-title]');
    const pageTitle = document.querySelector<HTMLElement>('[data-checkout-page-title]');
    const pageSubtitle = document.querySelector<HTMLElement>('[data-checkout-subtitle]');

    if (progressFill) {
      progressFill.style.width = step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%';
    }
    if (stepNumText) {
      stepNumText.textContent = `Step ${step} of 3`;
    }
    if (stepTitleText) {
      stepTitleText.textContent = step === 1 ? 'Your details' : step === 2 ? 'Delivery address' : 'Review order';
    }
    if (pageTitle) {
      pageTitle.textContent = step === 1 ? 'Your details' : step === 2 ? 'Delivery address' : 'Review order';
    }
    if (pageSubtitle) {
      pageSubtitle.textContent = step === 1 
        ? 'A couple of details for delivery' 
        : step === 2 
        ? 'Where should we deliver your pantry?' 
        : 'Check your items before sending on WhatsApp';
    }

    for (let s = 1; s <= 3; s++) {
      const card = checkout!.querySelector<HTMLElement>(`[data-step-card="${s}"]`);
      const body = checkout!.querySelector<HTMLElement>(`[data-step-body="${s}"]`);
      const summary = checkout!.querySelector<HTMLElement>(`[data-step-summary="${s}"]`);
      const editBtn = checkout!.querySelector<HTMLButtonElement>(`[data-edit-step="${s}"]`);
      const navItem = document.querySelector<HTMLElement>(`[data-nav-step="${s}"]`);

      if (!card) continue;

      if (s === step) {
        card.className = 'checkout-step-card active';
        if (body) body.hidden = false;
        if (summary) summary.hidden = true;
        if (editBtn) editBtn.hidden = true;
        if (navItem) { navItem.classList.add('active'); navItem.classList.remove('completed'); }
      } else if (s < step) {
        card.className = 'checkout-step-card completed';
        if (body) body.hidden = true;
        if (summary) summary.hidden = false;
        if (editBtn) editBtn.hidden = false;
        if (navItem) { navItem.classList.remove('active'); navItem.classList.add('completed'); }
      } else {
        card.className = 'checkout-step-card disabled';
        if (body) body.hidden = true;
        if (summary) summary.hidden = true;
        if (editBtn) editBtn.hidden = true;
        if (navItem) { navItem.classList.remove('active'); navItem.classList.remove('completed'); }
      }
    }

    if (stickyAction) {
      if (step === 1) stickyAction.textContent = 'Continue →';
      else if (step === 2) stickyAction.textContent = 'Review order →';
      else stickyAction.textContent = 'Place Order on WhatsApp →';
    }

    const currentCard = checkout!.querySelector<HTMLElement>(`[data-step-card="${step}"]`);
    currentCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function validateStep1(): boolean {
    let valid = true;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name) {
      showError('name', 'Please enter your name.');
      nameInput.focus();
      valid = false;
    } else {
      clearError('name');
    }

    if (!phone || !validIndianPhone(phone)) {
      showError('phone', 'Please enter a valid mobile number.');
      if (valid) phoneInput.focus();
      valid = false;
    } else {
      clearError('phone');
    }

    if (valid) {
      const summaryName = checkout!.querySelector<HTMLElement>('[data-summary-name]');
      const summaryPhone = checkout!.querySelector<HTMLElement>('[data-summary-phone]');
      if (summaryName) summaryName.textContent = name;
      if (summaryPhone) summaryPhone.textContent = phone;
    }

    return valid;
  }

  function validateStep2(): boolean {
    let valid = true;
    const pin = pinInput.value.trim();
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();

    if (!/^[1-9]\d{5}$/.test(pin)) {
      showError('pinCode', 'Please enter a valid 6-digit PIN code.');
      pinInput.focus();
      valid = false;
    } else {
      clearError('pinCode');
    }

    if (!city) {
      if (cityStateRow) cityStateRow.hidden = false;
      if (detectedRow) detectedRow.hidden = true;
      showError('city', 'Please enter your city.');
      if (valid) cityInput.focus();
      valid = false;
    } else {
      clearError('city');
    }

    if (!state) {
      if (cityStateRow) cityStateRow.hidden = false;
      if (detectedRow) detectedRow.hidden = true;
      showError('state', 'Please enter your state.');
      if (valid) stateInput.focus();
      valid = false;
    } else {
      clearError('state');
    }

    if (!address || address.length < 5) {
      showError('address', 'Please enter your delivery address.');
      if (valid) addressInput.focus();
      valid = false;
    } else {
      clearError('address');
    }

    if (valid) {
      const apt = apartmentInput?.value.trim() ? `, ${apartmentInput.value.trim()}` : '';
      const fullStreet = `${address}${apt}`;
      const cityPin = `${city}, ${state} – ${pin}`;

      const summaryAddr = checkout!.querySelector<HTMLElement>('[data-summary-address]');
      const summaryCityPin = checkout!.querySelector<HTMLElement>('[data-summary-city-pin]');
      if (summaryAddr) summaryAddr.textContent = fullStreet;
      if (summaryCityPin) summaryCityPin.textContent = cityPin;

      // Populate Step 3 review recaps
      const revName = checkout!.querySelector<HTMLElement>('[data-review-name]');
      const revPhone = checkout!.querySelector<HTMLElement>('[data-review-phone]');
      const revAddr = checkout!.querySelector<HTMLElement>('[data-review-address]');
      const revCityPin = checkout!.querySelector<HTMLElement>('[data-review-city-pin]');
      const revNote = checkout!.querySelector<HTMLElement>('[data-review-note]');

      if (revName) revName.textContent = nameInput.value.trim();
      if (revPhone) revPhone.textContent = phoneInput.value.trim();
      if (revAddr) revAddr.textContent = fullStreet;
      if (revCityPin) revCityPin.textContent = cityPin;

      if (revNote) {
        const note = noteInput?.value.trim();
        if (note) {
          revNote.textContent = `Note: ${note}`;
          revNote.hidden = false;
        } else {
          revNote.hidden = true;
        }
      }
    }

    return valid;
  }

  // Continue triggers
  checkout.querySelector<HTMLButtonElement>('[data-continue-step="1"]')?.addEventListener('click', () => {
    if (validateStep1()) {
      goToStep(2);
      if (!pinInput.value) pinInput.focus();
    }
  });

  checkout.querySelector<HTMLButtonElement>('[data-continue-step="2"]')?.addEventListener('click', () => {
    if (validateStep2()) {
      goToStep(3);
    }
  });

  // Edit triggers
  checkout.querySelector<HTMLButtonElement>('[data-edit-step="1"]')?.addEventListener('click', () => {
    goToStep(1);
    nameInput.focus();
  });

  checkout.querySelector<HTMLButtonElement>('[data-edit-step="2"]')?.addEventListener('click', () => {
    goToStep(2);
    addressInput.focus();
  });

  // Step nav indicator click triggers
  document.querySelectorAll<HTMLElement>('[data-nav-step]').forEach(item => {
    item.addEventListener('click', () => {
      const step = Number(item.dataset.navStep) as 1 | 2 | 3;
      if (step === 1) goToStep(1);
      else if (step === 2 && validateStep1()) goToStep(2);
      else if (step === 3 && validateStep1() && validateStep2()) goToStep(3);
    });
  });

  // Sticky bottom action
  stickyAction?.addEventListener('click', () => {
    if (activeStep === 1) {
      if (validateStep1()) goToStep(2);
    } else if (activeStep === 2) {
      if (validateStep2()) goToStep(3);
    } else if (activeStep === 3) {
      submitBtn?.click();
    }
  });

  // Form submission connected to POST /api/orders/draft
  checkout.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validateStep1()) { goToStep(1); return; }
    if (!validateStep2()) { goToStep(2); return; }

    const status = document.querySelector<HTMLElement>('[data-checkout-status]')!;
    const submitBtn = checkout.querySelector<HTMLButtonElement>('[data-checkout-submit]');
    const stickyAction = document.querySelector<HTMLButtonElement>('[data-sticky-action]');

    if (submitBtn?.disabled && submitBtn.textContent?.includes('Preparing')) return;

    const originalSubmitText = submitBtn?.textContent || 'Place Order on WhatsApp →';
    const originalStickyText = stickyAction?.textContent || 'Place Order on WhatsApp →';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preparing Order...';
    }
    if (stickyAction) {
      stickyAction.disabled = true;
      stickyAction.textContent = 'Preparing Order...';
    }
    status.textContent = 'Preparing your order draft…';
    status.className = 'checkout-status-msg';

    try {
      const items = store.getItems().map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }));

      if (!items.length) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }

      const customer: Customer = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim(),
        pinCode: pinInput.value.trim(),
        apartment: apartmentInput?.value.trim() || undefined,
        note: noteInput?.value.trim() || undefined
      };

      const res = await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer })
      });

      const data = await res.json() as any;

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Couldn't prepare your order. Please try again.");
      }

      const preview = document.querySelector<HTMLDetailsElement>('[data-message-preview]');
      if (preview) {
        preview.hidden = false;
        const pre = preview.querySelector('pre');
        if (pre) pre.textContent = data.whatsappMessage;
      }
      const waLink = document.querySelector<HTMLAnchorElement>('[data-whatsapp-link]');
      if (waLink) waLink.href = data.whatsappUrl;

      status.textContent = `✓ Order ${data.orderNumber} prepared! WhatsApp is opening with your items. Review and press Send.`;
      status.className = 'checkout-status-msg success';

      // Clear the local cart since order draft has been committed to D1
      store.clear();

      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');

      if (submitBtn) submitBtn.textContent = 'Order Prepared ✓';
      if (stickyAction) stickyAction.textContent = 'Order Prepared ✓';
    } catch (error: any) {
      status.textContent = error?.message || "Couldn't prepare your order. Please try again.";
      status.className = 'checkout-status-msg error';
      status.scrollIntoView({ block: 'nearest' });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalSubmitText;
      }
      if (stickyAction) {
        stickyAction.disabled = false;
        stickyAction.textContent = originalStickyText;
      }
    }
  });

  // Keyboard Enter support
  nameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); phoneInput.focus(); } });
  phoneInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); checkout.querySelector<HTMLButtonElement>('[data-continue-step="1"]')?.click(); } });
  pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addressInput.focus(); } });
}

// Initialise progressive checkout if on checkout page
initCheckoutProgressive();

// Search functionality
document.querySelector<HTMLInputElement>('[data-product-search]')?.addEventListener('input',event=>{
  const query=(event.target as HTMLInputElement).value.trim().toLowerCase();let shown=0;
  document.querySelectorAll<HTMLElement>('[data-product-card]').forEach(card=>{card.hidden=!card.dataset.searchName?.includes(query);if(!card.hidden)shown++;});
  const count=document.querySelector('[data-results-count]');if(count)count.textContent=`${shown} ${shown===1?'product':'products'}`;
  const empty=document.querySelector<HTMLElement>('[data-search-empty]');if(empty)empty.hidden=shown>0;
});
