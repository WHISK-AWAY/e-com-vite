# Project: Skin care e-com

## Helpful Info:

- gromit@veryoddjobs.co.uk | fluffles
- wallace@veryoddjobs.co.uk | wensleydale
- 4242 4242 4242 4242 <-- working CC number
- 4000 0000 0000 9995 <-- failing/declined CC number
- Typical screen sizes:
  - md: 768 x 546
  - lg: 1024 x 728
  - xl: 1280 x 910
  - 2xl: 1440 x 1024


-Top 10 most common(jan 2022 - jan 2023):
  1 1920 x 1080 (8.83%)
  2 360 x 800 (7.43%)
  3 1366 x 768 (6.09%)
  4 1280 x 720 (6.07%)
  5 1536 x 864 (4.02%)
  6 390 x 844 (3.98%)
  7 412 x 915 (3.41%)
  8 393 x 837 (3.03%)
  9 360 x 780 (2.72%)
  10 360 x 640 (2.53%)

## Issues

### Open

- [ ] Why does the places API fail when address_2 === 'Apt C5'?
  - [ ] Need to trim inputs
- [ ] Add new / edit address functionality to user account section (maybe)
- [ ] Product catalog <-- prioritize!
  - [ ] Add more items (around 50 total -- now @ 43)
  - [ ] Assign correct tags/categories
- [ ] Order creation:
  - [x] promo code name failing @ route
  - [x] Order still gets created (?)
  - [ ] Need to clear order state as cleanup
  - [ ] Need to clear promo state as cleanup
  - [ ] Guest order should only try to create when no user id
- [x] Find a home for sign-out button
- [x] Scroll to top of products section when clicking next page button
- [x] Logo should point to home page
- [x] Cart checkout button should close cart (check favorites also)
- [x] Product images should point to single product page
- [ ] Bring back (render) search function
  - [ ] Style search function/results
- [ ] Verified purchase logic isn't working
- [ ] Checkout-section address book does not render all addresses
- [ ] `Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.` (SignIn.tsx @ 38)
- [x] Sign-in: 'Found 2 elements with non-unique id #email'
- [ ] Consider scrollbar styling for internal scrollbars (https://github.com/adoxography/tailwind-scrollbar)
  - Or instead just hide them altogether
- [ ] User feedback
  - [ ] Add to cart animation
  - [ ] Cart qty indicator
  - [ ] Add to favorites animation?
  - [x] Favorites indicator (maybe just a filled heart on nav?)

### Resolved

- [x] Logo should point to home page
- [x] Sign-in/sign-up: need cursor-pointer on alternate link ('sign up instead,' etc.)
- [x] Try the checkbox thing `<input type="checkbox" className="focus:ring-0 focus:ring-offset-0" />`
- [x] User Account Section
  - [x] Order History Details
    - [x] No scrollbars
    - [x] Uppercase product names
    - [x] Shipping address - do the same header box
  - [x] No scrollbar on order history
  - [x] Larger text on box header
    - [x] Maybe smaller on labels
  - [x] Narrow the inner menu wrapper, especially @ larger sizes
  - [x] Order history too close to top
  - [x] Account info form too wide
  - [x] ~~Address book arrows when address book length === 1???~~
  - [x] Move arrows outside of box
  - [x] Play with 'tracking-widest' on name @ bottom of screen
  - [x] Layout: Address book
  - [x] Layout: Order history/details
  - [x] Responsive styling throughout

## Other Notes
