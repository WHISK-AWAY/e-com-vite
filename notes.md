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

## Issues

### Open

- [ ] Why does the places API fail when address_2 === 'Apt C5'?
  - [ ] Need to trim inputs
- [ ] Try the checkbox thing `<input type="checkbox" className="focus:ring-0 focus:ring-offset-0" />`
- [ ] User Account Section
  - [x] Order history too close to top
  - [x] Account info form too wide
  - [x] ~~Address book arrows when address book length === 1???~~
  - [x] Move arrows outside of box
  - [x] Play with 'tracking-widest' on name @ bottom of screen
  - [x] Layout: Address book
  - [ ] New / edit address (maybe)
  - [x] Layout: Order history/details
  - [x] Responsive styling throughout
- [ ] Product catalog <-- prioritize!
  - [ ] Add more items (10-15 more -- around 50 total)
  - [ ] Assign correct tags/categories
- [x] Order creation: promo code name failing @ route
  - [x] Order still gets created (?)
  - [ ] Need to clear order state as cleanup
  - [ ] Need to clear promo state as cleanup
  - [ ] Guest order should only try to create when no user id
- [x] Find a home for sign-out button
- [ ] Scroll to top of products section when clicking next page button
- [ ] Logo should point to home page
- [ ] Cart checkout button should close cart (check favorites also)
- [ ] Product images should point to single product page
- [ ] Bring back (render) search function
  - [ ] Style search function/results
- [ ] Verified purchase logic isn't working
- [x] Sign-in/sign-up: need cursor-pointer on alternate link ('sign up instead,' etc.)
- [ ] Checkout-section address book does not render all addresses
- [ ] `Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.` (SignIn.tsx @ 38)
- [ ] Sign-in: 'Found 2 elements with non-unique id #email'
- [ ] Consider scrollbar styling for internal scrollbars (https://github.com/adoxography/tailwind-scrollbar)
  - Or instead just hide them altogether
- [ ] User feedback
  - [ ] Add to cart animation
  - [ ] Cart qty indicator
  - [ ] Add to favorites animation?
  - [ ] Favorites indicator (maybe just a filled heart on nav?)

### Resolved

## Other Notes
