# Catalog records

This directory contains the 24 entries read from the Product Catalog. Stable IDs preserve original text in `source.raw`, source references, conflicts and review notes. The SEO Blueprint controls categories and relationships. The redesign changes presentation only.

Amounts use integer INR paise. Unknown stock, nutrition, allergens and other facts remain null. Keep separate entries separate until equivalence is confirmed. Four incomplete bundles remain non-orderable; unconfirmed variant prices cannot be added as priced orders.

Records have review status. Local review routes are allowed only while indexing is disabled. Publishing rejects unresolved conflicts; do not bypass source review by turning on indexing.

Shipping follows explicit source rules. Unconfirmed quantities, conflicts and mixed-cart aggregation return unknown shipping and no grand total. Checkout may prepare a request saying Shipping to be confirmed. Exact promotions are never extrapolated.

Replace photography by putting approved derivatives in `public/images/products/` and updating the record's `images` entries with paths, descriptive alt text, dimensions and responsive `sources`. ProductImage reserves the slot, loads the main detail image eagerly and grid images lazily. Do not use competitor images or fabricated packaging. Preserve source evidence when updating records.
