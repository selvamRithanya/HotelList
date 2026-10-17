# Hotel List UI

Single-page React app for browsing and managing hotels. It talks to the API in [`../Service`](../Service).

**Stack:** React 19, Redux Toolkit, React Router, react-helmet-async, Leaflet (OpenStreetMap), Vite and plain CSS.

## Run it

1. Start the Service on port 3000 (see its README).
2. Install and start the UI:

   ```bash
   npm install
   npm run dev        # http://localhost:5173
   ```

In development, Vite proxies `/api` and `/uploads` to `http://localhost:3000`. To use a different Service address, copy `.env.example` to `.env` and set `VITE_PROXY_TARGET`. For a production build that calls the Service directly, set `VITE_API_BASE_URL`.

To build for production:

```bash
npm run build      # outputs dist/
npm run preview
```

Serve `dist/` with a fallback to `index.html` so that client-side routes work.

## Pages

| Route              | Page                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `/hotels`          | List page: card list, title search, price filter, sort, pagination   |
| `/hotels/new`      | Add-hotel form                                                       |
| `/hotels/:id`      | Detail page: full details and a map with your location and distance |
| `/hotels/:id/edit` | Edit form (the same form component as add)                           |

## Features

- **Add/edit form** (`HotelForm`): one component for both modes.
  - The image picker supports drag and drop and shows a preview.
  - Every field is validated on the client, using the same rules as the API. Server-side validation errors are shown next to the matching fields.
  - Location can be set by typing coordinates, using **Use my current location** (Geolocation API), or clicking the map.
- **List page:**
  - Hotels appear as cards with a list/grid toggle.
  - Title search runs as you type (debounced).
  - Price can be filtered with min/max inputs or quick price ranges.
  - Results can be sorted and paged.
  - Search, filters and the current page are kept in the URL, so they can be shared and the back button works.
  - On small screens, the filters move into a slide-in panel.
- **Delete:** a confirmation dialog, with an option to also remove the image file, followed by a success popup.
- **Detail page:**
  - Clicking a card opens it.
  - It shows the full description, price and dates, plus a Leaflet map with the hotel's pin.
  - With location permission, it also shows your position, the distance to the hotel, and a "Get directions" link.
- **SEO:**
  - Each page sets its title, description, canonical URL, Open Graph and Twitter tags with react-helmet-async.
  - The detail page adds `Hotel` JSON-LD structured data.
  - Every image has an `alt` attribute.
- **Accessibility:** labelled form controls, focus-trapped dialogs, a skip link, `aria-current` on breadcrumbs and pagination, and support for reduced motion.

## Structure

```
src/
  api/              fetch client + hotels endpoints
  app/store.js      Redux store
  features/
    hotels/         hotelsSlice: list, current hotel, create/update/delete thunks
    ui/             uiSlice: toasts and the global success popup
  hooks/            useHotelQuery (URL filters), useHotelDelete, useGeolocation, ...
  components/
    common/         Modal, ConfirmDialog, Pagination, Seo, FormField, Collapsible, Icon, ...
    hotels/         HotelForm, HotelCard, HotelList, HotelFilters, ImageUpload, HotelMap, ...
    layout/         Layout, AppBar, PageHeader
  pages/            HotelListPage, HotelDetailPage, HotelFormPage, NotFoundPage
  utils/            formatting, validation, geo helpers
  styles/global.css design tokens and base styles
```
