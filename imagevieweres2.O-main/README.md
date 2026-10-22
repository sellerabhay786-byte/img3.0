# Amazon Ultra-Fast Product Image Viewer & Editor (5 Lac SKU)

An ultra-high-performance web application designed for Amazon sellers, catalog managers, and ecommerce operators to parse, inspect, edit, and re-export massive Excel datasets containing 500,000+ product image links with zero UI lag.

---

## 📑 Complete Repository File Directory & Detailed Explanation

This codebase is organized into modular layers: configuration, serverless edge functions, a full-stack Express server, and a high-performance React + TypeScript single-page application. Below is a detailed breakdown of **every file** in the repository.

```
├── .env.example                                  # Environment variables template
├── bun.lock                                      # Deterministic lockfile
├── index.html                                    # Web entrypoint & SEO meta tags
├── metadata.json                                 # AI Studio platform configuration
├── package.json                                  # NPM dependencies & scripts
├── README.md                                     # Main project documentation (this file)
├── server.ts                                     # Express + Vite full-stack server
├── tsconfig.json                                 # TypeScript compiler options
├── vercel.json                                   # Vercel deployment & routing config
├── vite.config.ts                                # Vite bundler configuration
│
├── api/                                          # Vercel Serverless Edge Functions
│   ├── README.md                                 # Edge API documentation
│   ├── proxy-image.ts                            # CORS proxy for remote Amazon/CDN images
│   ├── remove-bg.ts                              # AI background remover (Remove.bg + ImgBB)
│   └── upload-imgbb.ts                           # Cloud image uploader (ImgBB API)
│
├── public/                                       # Static public assets
│   ├── favicon.ico                               # Multi-size browser tab favicon
│   ├── icon.png                                  # 512x512 High-res application & PWA icon
│   ├── preview.png                               # 1200x630 OpenGraph social preview card
│   ├── robots.txt                                # Search engine crawler instructions
│   └── sitemap.xml                               # XML sitemap for SEO discovery
│
└── src/                                          # React Client Application
    ├── App.tsx                                   # Core application state orchestrator
    ├── index.css                                 # Tailwind CSS global styles & custom rules
    ├── main.tsx                                  # React DOM bootstrap entrypoint
    ├── README.md                                 # Frontend architecture guide
    ├── types.ts                                  # TypeScript interfaces & domain types
    │
    ├── components/                               # Modular UI Components
    │   ├── EditLinkModal.tsx                     # Image URL editor & instant ImgBB uploader
    │   ├── EditProductMetadataModal.tsx          # Material, Category, Title editor modal
    │   ├── Header.tsx                            # Navigation bar, stats counters & actions
    │   ├── ImageCard.tsx                         # Gallery image card with lazy loading
    │   ├── ImgbbKeyModal.tsx                     # API keys configuration & test modal
    │   ├── ModalViewer.tsx                       # Full-screen carousel & detail inspector
    │   ├── SearchBar.tsx                         # Search input & status filter pills
    │   └── VirtualGallery.tsx                    # Virtualized dynamic grid engine
    │
    └── utils/                                    # Specialized Utility Engines
        ├── excelHelper.ts                        # XLSX parser & ExcelJS styled downloader
        ├── idbHelper.ts                          # IndexedDB local storage engine
        └── imageHelper.ts                        # CDN acceleration, Canvas & ImgBB uploaders
```

---

## 🛠️ Root Configuration & Deployment Files

### 1. `package.json`
- **Location**: `/package.json`
- **Purpose**: Defines project metadata, NPM script runners, runtime dependencies, and development toolchains.
- **Key Dependencies**:
  - `react` & `react-dom` (v19): Modern UI rendering engine.
  - `lucide-react`: Lightweight, accessible icon library.
  - `xlsx`: Fast binary sheet parser used to ingest large `.xlsx` and `.csv` files into tabular arrays.
  - `exceljs`: Advanced workbook builder used to preserve and output formatted Excel sheets with yellow cell highlights (`#FFFF00`).
  - `express` & `cors`: Full-stack Node.js server handling local API routes.
  - `vite` & `@vitejs/plugin-react`: Ultra-fast bundler and Hot Module Replacement (HMR) development server.
  - `tailwindcss` & `@tailwindcss/vite`: Utility-first CSS framework integrated via Vite plugin.
  - `tsx`: TypeScript execute runner used to run `server.ts` seamlessly without a separate compilation step.
- **Key Scripts**:
  - `npm run dev`: Starts the local Express + Vite development server on port 3000.
  - `npm run build`: Type-checks with `tsc -b` and compiles client assets into `dist/`.
  - `npm start`: Boots the production server `tsx server.ts`.
  - `npm run lint`: Analyzes the codebase for syntax and type issues.

### 2. `tsconfig.json`
- **Location**: `/tsconfig.json`
- **Purpose**: Configures the TypeScript compiler behavior across client and server files.
- **Key Compiler Options**:
  - `target: "ES2022"`, `module: "ESNext"`: Enables modern JavaScript syntax, async/await, and top-level await.
  - `jsx: "react-jsx"`: Enables the new JSX transform without needing manual `import React from 'react'`.
  - `strict: true`: Strict null checks and type safety to prevent runtime exceptions.
  - `moduleResolution: "bundler"`: Optimizes import resolution for Vite.

### 3. `vite.config.ts`
- **Location**: `/vite.config.ts`
- **Purpose**: Configuration file for the Vite build tool and development server.
- **Key Configurations**:
  - Integrates `@vitejs/plugin-react` and `@tailwindcss/vite`.
  - Configures server port to `3000` with `host: '0.0.0.0'` for cloud container compatibility.
  - Sets up optimized chunk splitting and asset hashing for production bundles.

### 4. `vercel.json`
- **Location**: `/vercel.json`
- **Purpose**: Configuration file for deployment on Vercel Edge / Serverless hosting.
- **Key Rules**:
  - `"trailingSlash": true`: Resolves URL canonicalization and ensures consistent routing.
  - `"rewrites"`: SPA fallback routing directing web requests to `/index.html` while strictly exempting `/api/*` routes so serverless functions in `api/` execute properly.

### 5. `server.ts`
- **Location**: `/server.ts`
- **Purpose**: Full-stack Node.js Express server running development & production endpoints.
- **Key Responsibilities**:
  - In development, attaches Vite middlewares (`vite.middlewares`) to serve the client with instant HMR.
  - In production, serves static compiled assets from `dist/`.
  - Provides local API routes:
    - `POST /api/remove-bg`: Proxies background removal requests to Remove.bg API, applies white background, and uploads to ImgBB.
    - `POST /api/upload-imgbb`: Direct upload proxy to `api.imgbb.com`.
    - `GET /api/proxy-img` & `GET /api/proxy-image`: Permissive CORS proxy for streaming remote Amazon and CDN images to canvas elements.
  - Handles fallback gracefully on static hosting by enabling client-side Canvas processing.

### 6. `.env.example`
- **Location**: `/.env.example`
- **Purpose**: Template documenting required and optional environment variables.
- **Variables**:
  - `REMOVE_BG_API_KEY`: API key for Remove.bg background removal service.
  - `VITE_REMOVE_BG_API_KEY`: Client-side exposed API key for direct browser background cutouts on static hosts.
  - `IMGBB_API_KEY`: Server-side API key for ImgBB cloud image hosting.
  - `VITE_IMGBB_API_KEY`: Client-side exposed API key for direct browser uploads when hosted on static sites.

### 7. `metadata.json`
- **Location**: `/metadata.json`
- **Purpose**: AI Studio applet definition file setting application name, description, frame permissions, and capability flags (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).

### 8. `index.html`
- **Location**: `/index.html`
- **Purpose**: Main HTML entry point of the Single Page Application.
- **Key Enhancements**:
  - Semantic title: `Amazon Image Viewer – Bulk Product Gallery & Excel Link Editor`.
  - Comprehensive SEO meta tags: `description`, `keywords`, `author`, `canonical`.
  - OpenGraph social cards: `og:title`, `og:description`, `og:image` (`/preview.png`), `og:type: website`.
  - Twitter / X summary large image card tags.
  - Structured data: Schema.org `WebApplication` JSON-LD snippet for rich search engine snippets.
  - App icons and favicon links for mobile and desktop browsers.

### 9. `bun.lock`
- **Location**: `/bun.lock`
- **Purpose**: Dependency lockfile ensuring consistent, reproducible package installation across environments.

---

## 🌐 Serverless API Functions (`api/`)

These files automatically deploy as isolated serverless microservices on platforms like Vercel:

### 10. `api/remove-bg.ts`
- **Location**: `/api/remove-bg.ts`
- **Purpose**: Serverless function for Remove.bg background removal and ImgBB link generation.
- **How It Works**:
  1. Accepts `imageUrl`, `bgColor` (`white` or `transparent`), optional `size`, and optional client-provided `removeBgKey` / `imgbbKey`.
  2. Sends request to `https://api.remove.bg/v1.0/removebg`.
  3. If successful, receives cleaned image buffer.
  4. Automatically uploads the result to ImgBB to generate a permanent public CDN link (`https://i.ibb.co/...`).
  5. Returns a JSON payload containing `dataUri`, `imgbbUrl`, `imgbbDisplayUrl`, and status flags.
  6. Includes full CORS support (`Access-Control-Allow-Origin: *`) and handles preflight `OPTIONS` requests.

### 11. `api/upload-imgbb.ts`
- **Location**: `/api/upload-imgbb.ts`
- **Purpose**: Serverless function for uploading base64 or URL images to ImgBB cloud storage.
- **How It Works**:
  1. Accepts base64 data string or image link.
  2. Uses environment variable `IMGBB_API_KEY` or client-supplied key.
  3. Formats payload as `application/x-www-form-urlencoded` and calls ImgBB v1 upload endpoint.
  4. Returns permanent direct link (`url`), thumbnail (`thumb`), and viewer link (`display_url`).
  5. Configured with CORS headers to allow cross-origin browser requests.

### 12. `api/proxy-image.ts`
- **Location**: `/api/proxy-image.ts`
- **Purpose**: High-speed image proxy for bypassing browser CORS restrictions.
- **How It Works**:
  1. Takes a `url` query parameter.
  2. Fetches the image server-side (bypassing browser same-origin policies).
  3. Sets permissive caching and `Access-Control-Allow-Origin: *` headers.
  4. Streams the raw binary image with correct `Content-Type` back to the browser so HTML5 `<canvas>` elements can sample pixels without "tainted canvas" security errors.

---

## 📁 Public Assets (`public/`)

### 13. `public/robots.txt`
- **Location**: `/public/robots.txt`
- **Purpose**: Directs search engine web crawlers. Allows unrestricted crawling of all public routes and specifies the sitemap location (`https://imagevieweres2-o-six.vercel.app/sitemap.xml`).

### 14. `public/sitemap.xml`
- **Location**: `/public/sitemap.xml`
- **Purpose**: XML sitemap documenting canonical homepage URL, change frequency (`weekly`), and indexing priority (`1.0`).

### 15. `public/favicon.ico`
- **Location**: `/public/favicon.ico`
- **Purpose**: Standard multi-resolution icon displayed in browser tabs and bookmarks.

### 16. `public/icon.png`
- **Location**: `/public/icon.png`
- **Purpose**: High-resolution (512x512) application brand icon used for Apple Touch bookmarks and Android mobile home screen shortcuts.

### 17. `public/preview.png`
- **Location**: `/public/preview.png`
- **Purpose**: High-definition 1200x630 social share card image displayed when links are shared on Slack, Twitter/X, LinkedIn, WhatsApp, or Facebook.

---

## 💻 Source Code & Architecture (`src/`)

### 18. `src/main.tsx`
- **Location**: `/src/main.tsx`
- **Purpose**: Client application entry point. Imports global styles (`index.css`) and mounts the root `<App />` component into the DOM `#root` container.

### 19. `src/index.css`
- **Location**: `/src/index.css`
- **Purpose**: Global stylesheet. Configures Tailwind CSS (`@import "tailwindcss";`), custom slim scrollbar styles, hover transition effects, badge styling, and layout normalization.

### 20. `src/types.ts`
- **Location**: `/src/types.ts`
- **Purpose**: Centralized TypeScript interface definitions:
  - `ImageItem`: Data contract for an individual product image entry:
    - `id`: Unique sequential index.
    - `rowIdx`, `colIdx`: Exact coordinates in the underlying Excel spreadsheet.
    - `sku`: Product SKU identifier.
    - `imgNo`: Position index within the SKU (1 = Main/Frontend, 2+ = Backend/Secondary).
    - `link`: Current active URL (can be edited, replaced, or updated with ImgBB).
    - `originalLink`: Original unedited URL from the uploaded file.
    - `deleted`: Flag indicating whether this image is marked for deletion.
    - `isFrontend`: Boolean flag distinguishing Main thumbnail from secondary images.
    - `title`, `material`, `includes`, `category`: Associated product metadata fields.
    - `isEditedLink`, `isEditedMeta`: Flags tracking modified state for highlighting and export.
  - `AppStats`: Metrics summary interface (total rows, total images, deleted count, highlighted rows, edited links).
  - `FilterStatus`: Union type for active gallery filtering (`'all' | 'frontend' | 'highlighted' | 'deleted' | 'edited' | 'broken'`).
  - `SavedState`: Schema representing session snapshot data stored in IndexedDB.

### 21. `src/App.tsx`
- **Location**: `/src/App.tsx`
- **Purpose**: Main application component and state controller.
- **Key Responsibilities**:
  - **State Storage**: Manages active Excel data matrix, parsed image item list, highlighted row IDs, deleted item IDs, search query, filter modes, and active modal states.
  - **IndexedDB Auto-Save**: Debounced auto-save listener that persists modified data to IndexedDB after every link edit, deletion, or metadata update.
  - **Session Restoration**: Detects previously saved sessions on startup and offers instant 1-click restore.
  - **Keyboard Shortcuts**: Global `window.addEventListener('keydown')` handling carousel navigation (`← / →`), row toggle (`H`), delete toggle (`Del`), link edit (`E`), and metadata edit (`M`).
  - **Excel Ingestion & Export**: Coordinates file reading via `excelHelper.ts` and triggers styled workbook downloads.
  - **Background Removal Handler**: Executes background removal cascade with fallback to client Canvas if server routes are unavailable, updating spreadsheet cells with permanent ImgBB links.

---

## 🧩 UI Components (`src/components/`)

### 22. `src/components/Header.tsx`
- **Location**: `/src/components/Header.tsx`
- **Purpose**: Top navigation bar and command control center.
- **Features**:
  - Brand header and live status badges.
  - **Upload Button**: Drag-and-drop or file picker for `.xlsx` / `.csv` files.
  - **Demo Dataset Loaders**: Instant loading of sample Amazon catalogs for instant testing.
  - **Session Save/Clear**: Manual IndexedDB save button and clear cache trigger.
  - **Live Statistics**: Displays total SKUs, active images, deleted count, highlighted rows, and edited link counters.
  - **Export Buttons**: Download updated `.xlsx` with yellow highlighted rows preserved.
  - **Settings Button**: Opens the ImgBB / Remove.bg API key configuration modal.

### 23. `src/components/VirtualGallery.tsx`
- **Location**: `/src/components/VirtualGallery.tsx`
- **Purpose**: Ultra-high-performance virtualized grid engine capable of rendering 500,000+ items without UI stutter.
- **How It Works**:
  - Dynamically calculates container height, column width, and visible row slice based on current scroll position (`scrollTop`).
  - Only renders items currently visible inside the viewport window plus an overscan buffer.
  - Groups images by product SKU into horizontal rows.
  - Supports whole-row batch deletion, whole-row yellow highlighting, and individual card interactions.
  - Exposes imperative methods via `ref` (`scrollToItemId`, `scrollToRow`, `scrollToTop`).

### 24. `src/components/ImageCard.tsx`
- **Location**: `/src/components/ImageCard.tsx`
- **Purpose**: Individual image card displayed inside the product row grid.
- **Features**:
  - Lazy image rendering with edge-accelerated CDN fallbacks (`images.weserv.nl`).
  - Badge indicator showing `#1 Main` or `#2+ Child` position.
  - Red strikethrough overlay when marked for deletion.
  - Quick action toolbar:
    - ✏️ **Edit URL**: Opens the quick link modifier.
    - ✨ **Remove BG**: Triggers 1-click white background removal.
    - 🗑️ **Delete / Restore**: Toggles image deletion flag.
  - Click-to-enlarge opening the full `ModalViewer`.

### 25. `src/components/ModalViewer.tsx`
- **Location**: `/src/components/ModalViewer.tsx`
- **Purpose**: Full-screen modal inspector providing high-resolution product inspection.
- **Features**:
  - Interactive carousel for cycling through all images belonging to the selected SKU.
  - High-resolution pan and zoom capabilities.
  - One-click **Remove Background to Pure Studio White (#FFFFFF)** button.
  - Direct metadata overview (Title, Material, Category, Package Includes) with 1-click editor opening.
  - Complete keyboard shortcut support (`← / →`, `Del`, `H`, `E`, `M`, `Enter`, `Esc`).

### 26. `src/components/EditLinkModal.tsx`
- **Location**: `/src/components/EditLinkModal.tsx`
- **Purpose**: Modal dialog for replacing or editing image URLs.
- **Features**:
  - Real-time preview of the entered URL.
  - **Upload to ImgBB Button**: Converts local files or temporary data URLs into permanent, shareable public CDN links (`https://i.ibb.co/...`).
  - Direct integration with `excelData`: Updating a link automatically updates the corresponding row and column cell in the underlying Excel sheet.

### 27. `src/components/EditProductMetadataModal.tsx`
- **Location**: `/src/components/EditProductMetadataModal.tsx`
- **Purpose**: Modal interface for updating product metadata attributes directly inside the Excel matrix.
- **Editable Fields**:
  - Product Title
  - Material / Composition
  - Package Includes
  - Category / Department
- **Smart Behavior**: If the uploaded spreadsheet does not yet have columns for these fields, the modal automatically appends new columns to the header and aligns all rows accordingly.

### 28. `src/components/ImgbbKeyModal.tsx`
- **Location**: `/src/components/ImgbbKeyModal.tsx`
- **Purpose**: API configuration and credentials management dialog.
- **Features**:
  - Securely stores custom ImgBB and Remove.bg API keys in browser `localStorage`.
  - Includes a **Live Verification** button that performs a test request to confirm whether the key is active and has valid quota.
  - Displays instant signup links for free API keys (api.imgbb.com and remove.bg).
  - Eliminates disruptive browser alerts by rendering clear inline feedback badges.

### 29. `src/components/SearchBar.tsx`
- **Location**: `/src/components/SearchBar.tsx`
- **Purpose**: Filter and search control bar.
- **Features**:
  - Instant text search across SKU, Image URL, Title, Material, and Category.
  - Filter pills:
    - **All Images**
    - **Frontend Only** (Main #1 images)
    - **Highlighted** (Yellow marked rows)
    - **Deleted** (Items marked for removal)
    - **Edited** (Custom modified links or metadata)
    - **Broken** (Images that failed to load)

---

## ⚙️ Utility Engines (`src/utils/`)

### 30. `src/utils/excelHelper.ts`
- **Location**: `/src/utils/excelHelper.ts`
- **Purpose**: High-speed Excel file ingestion, column detection, and styled workbook generation.
- **Key Functions**:
  - `parseExcelFile(file: File)`: Reads `.xlsx` or `.csv` files as binary buffers and converts them into 2D tabular arrays.
  - `detectColumns(excelData)`: Automatically detects SKU, Title, Material, Package Includes, Category, Frontend Image Path, and Backend numbered image columns.
  - `isImageValue(val)`: Pattern matching engine detecting valid image URLs and extensions (`.jpg`, `.png`, `.jpeg`, `.webp`, `.gif`, `.avif`, `.svg`).
  - `exportToExcel(excelData, highlightedRows, fileName)`: Generates a formatted `.xlsx` workbook using `exceljs`, applying standard cell borders, header fills, and yellow row fills (`#FFFF00`) for all highlighted rows.

### 31. `src/utils/idbHelper.ts`
- **Location**: `/src/utils/idbHelper.ts`
- **Purpose**: Browser IndexedDB persistence wrapper for storing massive datasets.
- **Key Functions**:
  - `saveSessionToDB(session)`: Saves the entire 2D Excel matrix, highlighted row list, and deletion list into the `AmazonImageViewerDB` object store.
  - `loadSessionFromDB()`: Asynchronously loads the saved session upon user request or page reload.
  - `clearSessionDB()`: Clears stored sessions to reset storage.

### 32. `src/utils/imageHelper.ts`
- **Location**: `/src/utils/imageHelper.ts`
- **Purpose**: Image processing, edge acceleration, client-side Canvas background removal, and multi-tier ImgBB uploading.
- **Key Functions**:
  - `getAcceleratedImageUrl(link, options)`: Routes heavy or slow remote images through Cloudflare-backed global edge accelerators (`images.weserv.nl`), applying WebP compression and instant resizing.
  - `uploadToImgbb(image, options)`: Multi-tier uploader:
    - *Tier 1*: Attempts `/api/upload-imgbb` (Vercel Serverless or Express).
    - *Tier 2*: If serverless route is unavailable (e.g. static hosting on GitHub Pages or Netlify), falls back directly to `https://api.imgbb.com/1/upload` via client-side CORS.
  - `requestRemoveBg(imageUrl, options)`: Multi-tier background remover:
    - *Tier 1*: Calls `/api/remove-bg` server endpoint.
    - *Tier 2*: If unavailable, automatically executes client-side HTML5 Canvas background removal (`removeBackgroundOnCanvas`), detecting corner background tints, converting to pure white (`#FFFFFF`) or transparent, and uploading to ImgBB.
  - `getStoredImgbbKey()` & `setStoredImgbbKey()`: Manages ImgBB credentials across `localStorage` and environment variables.

---

## ⚡ Keyboard Shortcuts Reference

| Key | Action |
| :--- | :--- |
| `←` / `→` | Navigate to Previous / Next image in modal carousel |
| `Del` | Mark current image for deletion or restore it |
| `H` | Toggle yellow highlight on the current product row |
| `E` | Open the Image Link Editor dialog |
| `M` | Open the Material, Category & Metadata Editor |
| `Enter` | Keep current product and advance to the next SKU |
| `Esc` | Close modal viewer or editor dialog |

---

## 🚀 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. The included `vercel.json` and `api/` directory will automatically configure:
   - Static client assets built from `dist/`
   - Serverless functions for `/api/remove-bg`, `/api/upload-imgbb`, and `/api/proxy-image`
4. Add your optional API keys in the Vercel Project Settings under **Environment Variables**:
   - `REMOVE_BG_API_KEY`: Your Remove.bg API key.
   - `IMGBB_API_KEY`: Your ImgBB API key.

### Deploy to Netlify / GitHub Pages (Static Hosting)
- This application features **100% Client-Side Web Resilience**:
- If deployed to static hosts without serverless functions, the application automatically uses:
  - Client-side CORS uploads to `api.imgbb.com`
  - Client-side Canvas background removal to Amazon Pure White (`#FFFFFF`)
  - IndexedDB storage directly inside the user's browser.