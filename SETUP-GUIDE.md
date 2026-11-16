# Luztech website: setup guide

Everything that needs Gordon's real information is listed here. Work through it top to bottom before the site goes live.

## 1. Business details (one file, 2 minutes)

Open `js/site.js`. At the top is a block called `LUZTECH`. Fill in:

| Setting | Example | Where it shows |
|---|---|---|
| `whatsapp` | `"27787760198"` (set) | Every WhatsApp button |
| `phone` | `"078 776 0198"` (set) | Footer, contact page (tap to call on phones) |
| `area` | `"Midrand"` (set) | Home page strip, service pages, footer, about, contact |
| `hours` | `"Mon–Sun, 6am–6pm"` (set) | Home page strip, footer, about, contact |
| `googleReviews` | Link to the Google Business Profile | Footer star icon and "Read more reviews on Google" |
| `facebook`, `instagram` | Full page links | Footer icons, "See more jobs" on the Our work page |

Leave a link as `""` and it hides itself.

## 2. Photos

Gordon's photos are already in the `images` folder: cropped, colour-corrected and compressed. To swap one, save a new photo with the same file name and it replaces the old one automatically.

| File | Shows | Where it's used |
|---|---|---|
| `hero.jpg`, `hero-1b.jpg` | Mine platform network; team on site | Home page, large rotating photo at the top |
| `hero-2.jpg`, `hero-2b.jpg` | Server room; site visit | Home page, rotating photo at the top |
| `hero-3.jpg`, `hero-3b.jpg` | Site survey with binoculars; camera install on a pole | Home page, rotating photo at the top |
| `service-hardware.jpg` | Custom PC build | Hardware tile and page |
| `service-software.jpg` | Working at the server console | Software tile and page |
| `service-support.jpg` | Team on site with the bakkies | IT support tile and page |
| `service-cameras.jpg` | Perimeter camera install | Cameras tile and page |
| `cam-home.jpg`, `cam-perimeter.jpg`, `cam-wifi.jpg`, `cam-indoor.jpg`, `cam-warehouse.jpg`, `cam-restricted.jpg` | Camera examples | Cameras page gallery |
| `pc-build.jpg`, `pc-repair.jpg`, `pc-board.jpg` | PC build, desktop repair, laptop board repair | Computer repairs page gallery |
| `gordon.jpg` | Gordon in the red vest, with the Luztech logo | Home page and About page |
| `work-1.jpg` … `work-9.jpg` | Recent jobs | Home page (first three) and Our work page |
| `share.jpg` | Preview image when the site is shared on WhatsApp or Facebook | Link previews |

Job titles on the Our work page describe what each photo shows. If Gordon wants to add the town or client for each job, edit them in `our-work.html` and `index.html`.

## 3. Text placeholders

Search all `.html` files for `[` to find every placeholder.

- **Reviews** (`index.html`): real reviews only, in the client's words, with their name and town, and with their permission. If there are none yet, delete the "What clients say" section until there are.
- **LocalBusiness details** (`index.html`, inside `<script type="application/ld+json">`): already filled in. This tells Google the business details.

## 4. Before launch

1. **Google Business Profile.** Create or claim it at business.google.com, add photos and the website, and ask happy clients for reviews. This matters more than anything else for local searches.
2. **Google Analytics (optional).** Create a property, copy the Measurement ID (`G-…`) and paste it into the commented snippet in the `<head>` of each page, then remove the comment markers. WhatsApp button clicks are counted automatically as `whatsapp_click` events.
3. **Google Search Console.** Add luztech.co.za and submit the site, so Google finds every page.
4. **Test on a phone.** Tap every WhatsApp button and check it opens a chat with the right number and message.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Services overview | `services.html` |
| Computer repairs & hardware | `computer-repairs.html` |
| Software & email setup | `software-setup.html` |
| IT support | `it-support.html` |
| Cameras & remote monitoring | `cctv-installation.html` |
| Camera quote helper | `camera-quote.html` |
| Remote help | `remote-help.html` |
| Our work | `our-work.html` |
| About | `about.html` |
| Contact / get a quote | `contact.html` |
