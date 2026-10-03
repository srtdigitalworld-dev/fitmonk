import { addItem, loadCart, saveCart, setQuantity, type CartItem } from './index';

// Imported only by future cart/quantity components; never by the static layout.
export function createBrowserCart(onChange: (items: CartItem[], error: string | null) => void) {
  let items: CartItem[] = [];
  function refresh() {
    try { const saved = loadCart(window.localStorage); items = saved.items; onChange(items, saved.error); }
    catch { onChange(items, 'Cart storage is unavailable in this browser.'); }
  }
  function update(next: CartItem[]) {
    items = next;
    let error: string | null;
    try { error = saveCart(window.localStorage, items); }
    catch { error = 'Cart storage is unavailable in this browser.'; }
    onChange(items, error);
  }
  refresh();
  const sync = (event: StorageEvent) => { if (event.key === 'fitmonk.cart.v1' || event.key === null) refresh(); };
  window.addEventListener('storage', sync);
  return {
    getItems: () => items.map(item => ({ ...item })),
    add: (item: CartItem) => update(addItem(items, item)),
    setQuantity: (item: CartItem, quantity: number) => update(setQuantity(items, item, quantity)),
    clear: () => update([]),
    destroy: () => window.removeEventListener('storage', sync),
  };
}
