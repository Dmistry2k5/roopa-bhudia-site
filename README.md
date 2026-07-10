# Roopa Bhudia — portfolio site

A fast, static portfolio site for Roopa Bhudia, model and actor (London).
No build step, no framework. Just HTML, CSS and a little JavaScript.

```
roopa-bhudia-site/
  index.html          Home (hero, portfolio, showreel, comp card, range, work, about)
  contact.html        Booking page with a Netlify form
  thanks.html         Shown after the form is sent
  assets/
    css/style.css
    js/main.js
    img/              Local image copies (optional, see step 5)
    logo/             Drop the logo here (see step 2)
  netlify.toml
  download-assets.sh  Optional helper to self-host the images
```

## Preview it locally

Just open `index.html` in a browser. That is enough to see everything.
If you want a local server: `python3 -m http.server` then visit `http://localhost:8000`.

---

## Before it goes fully live (5 quick things)

1. **Confirm the stats.** The comp card on `index.html` uses the figures from the
   Sandra Reynolds profile (height 5'7", 32E, waist 29", hips 37", dress 12, shoe 6).
   Other agency listings show slightly different numbers, so have Roopa confirm each
   one. Search the file for `CONFIRM STAT`.

2. **Add the logo.** Two logo options were generated in Bloom. Pick the one Roopa
   likes, download it, and save it as `assets/logo/logo.svg` (or `logo.png`).
   Then in `index.html` and `contact.html`, find the `nav__mark` block, uncomment the
   `<img>` line, and delete the two text spans. Search for `LOGO`.

3. **Set the booking email.** Replace `hello@roopabhudia.com` in `contact.html`
   (and the mailto links) with the real address. Search for `CONTACT DETAIL`.

4. **Check the images.** The photos load from Roopa's agency profile and are used
   with her and the agency's permission. If she has her own high-resolution originals,
   they will look sharper, swap them in. To reorder the gallery so the strongest shots
   lead, just move the `<figure>` blocks in `index.html`.

5. **Socials.** Add or remove the Instagram / TikTok / Spotlight links in
   `contact.html`. Search for `SOCIAL`.

---

## Put it on GitHub (new repo)

From the `roopa-bhudia-site` folder on your Mac:

```bash
git init
git add .
git commit -m "Roopa Bhudia portfolio site"
git branch -M main
```

Create an empty repo on github.com (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/roopa-bhudia-site.git
git push -u origin main
```

## Deploy on Netlify

**Option A, connect the repo (recommended):**
1. Netlify dashboard, "Add new site", "Import an existing project".
2. Pick GitHub and the `roopa-bhudia-site` repo.
3. Leave the build command empty. Set publish directory to `.` (already set in `netlify.toml`).
4. Deploy. Every future `git push` redeploys automatically.

**Option B, drag and drop:** drag the `roopa-bhudia-site` folder onto the Netlify
"Sites" area. Good for a quick first look, but you lose auto-deploy on push.

### The contact form
The form uses **Netlify Forms**, which works automatically once deployed, no backend needed.
Submissions appear under **Forms** in the Netlify dashboard. To get an email on each
enquiry: Netlify site settings, Forms, Form notifications, add an email notification.

### Custom domain
Netlify site settings, Domain management, add `roopabhudia.com` (or similar) and follow
the DNS steps. HTTPS is automatic.

---

## Optional: self-host the images

The images load from the agency CDN by default. To keep copies in the repo instead
(so the site never depends on their servers):

```bash
chmod +x download-assets.sh
./download-assets.sh
# macOS:
sed -i '' 's#https://media.sandrareynolds.co.uk/models/#assets/img/#g' index.html
```

Then commit and push.

---

## SEO

The site now includes: descriptive titles and meta descriptions, a canonical URL per page,
Open Graph and Twitter tags with a branded share image (`assets/img/og-image.jpg`),
Schema.org Person structured data, `robots.txt`, and `sitemap.xml`.

**After deploying, do these once to get found on Google:**
1. Go to Google Search Console (search.google.com/search-console), add the site, verify it
   (Netlify makes this easy with a DNS or meta-tag method).
2. Submit `sitemap.xml` in Search Console under "Sitemaps".
3. Optional: do the same at Bing Webmaster Tools.

**If you switch to a custom domain later** (e.g. roopabhudia.com), update the URLs:
find and replace `https://roopabhudia.netlify.app` with the new domain across
`index.html`, `contact.html`, `robots.txt` and `sitemap.xml`, then redeploy.

**Biggest ongoing SEO wins:** real photos with descriptive filenames and alt text,
a custom domain, and getting her agency/Spotlight profiles and socials to link to the site.
