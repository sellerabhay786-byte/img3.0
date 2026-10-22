import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { ImageItem } from '../types';
import { safeStr } from './imageHelper';

export interface ParseResult {
  excelData: (string | number)[][];
  imageDataList: ImageItem[];
  skuColIndex: number;
  frontendColIndex: number;
  backendColIndices: number[];
}

// Ultra-fast Image URL / Path detection
export function isImageValue(val: string): boolean {
  if (!val || typeof val !== 'string' || val.length < 4) return false;
  const trimmed = val.trim();
  
  // Fast character / prefix checks
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return true;

  // Clean query string and hash for file extension check
  const pathOnly = trimmed.split('?')[0].split('#')[0].toLowerCase();
  if (
    pathOnly.endsWith('.jpg') ||
    pathOnly.endsWith('.png') ||
    pathOnly.endsWith('.jpeg') ||
    pathOnly.endsWith('.webp') ||
    pathOnly.endsWith('.gif') ||
    pathOnly.endsWith('.avif') ||
    pathOnly.endsWith('.svg') ||
    pathOnly.endsWith('.bmp')
  ) {
    return true;
  }

  // Check remote URL format
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    const lower = trimmed.toLowerCase();
    // Known image hosts or paths with image indicators
    if (
      lower.includes('images-amazon.com') ||
      lower.includes('media-amazon.com') ||
      lower.includes('ssl-images-amazon.com') ||
      lower.includes('ibb.co') ||
      lower.includes('imgur.com') ||
      lower.includes('/images/') ||
      lower.includes('/image/') ||
      lower.includes('/img/') ||
      lower.includes('.jpg') ||
      lower.includes('.jpeg') ||
      lower.includes('.png') ||
      lower.includes('.webp')
    ) {
      return true;
    }
    return true;
  }

  return false;
}

// Fast Column Detection Algorithm
export function detectColumns(excelData: (string | number)[][]) {
  let skuColIndex = 0;
  let titleColIndex = -1;
  let materialColIndex = -1;
  let includesColIndex = -1;
  let categoryColIndex = -1;
  let frontendColIndex = -1;
  const backendColIndices: number[] = [];

  const headerRow = excelData[0] || [];

  for (let i = 0; i < headerRow.length; i++) {
    const col = headerRow[i];
    if (col === undefined || col === null) continue;
    const h = String(col).toLowerCase().trim();

    if (h.includes('sku')) skuColIndex = i;
    if (titleColIndex === -1 && (h.includes('title') || h.includes('name') || h.includes('product'))) {
      titleColIndex = i;
    }
    if (materialColIndex === -1 && (h.includes('material') || h.includes('composition'))) {
      materialColIndex = i;
    }
    if (includesColIndex === -1 && (h.includes('include') || h.includes('package') || h.includes('contains'))) {
      includesColIndex = i;
    }
    if (categoryColIndex === -1 && (h.includes('category') || h.includes('type') || h.includes('class'))) {
      categoryColIndex = i;
    }
    // High-priority frontend / main image column match
    if (
      frontendColIndex === -1 &&
      (
        (h.includes('image') && (h.includes('path') || h.includes('link') || h.includes('url') || h.includes('main') || h.includes('front') || h.includes('primary'))) ||
        h === 'main' ||
        h === 'front' ||
        h === 'main_image_url' ||
        h === 'main_image' ||
        h === 'image_path' ||
        h === 'image_url'
      )
    ) {
      frontendColIndex = i;
    }
  }

  // Detect Backend Columns (numbered columns like 1, 2, 3, 4, 5... or secondary image headers)
  for (let i = 0; i < headerRow.length; i++) {
    if (i === frontendColIndex) continue;
    const col = headerRow[i];
    if (col === undefined || col === null) continue;
    const h = String(col).trim();
    if (/^\d+$/.test(h) || /image|photo|pic/i.test(h)) {
      backendColIndices.push(i);
    }
  }

  // Fallback if no specific Image Path header was found
  if (frontendColIndex === -1 && excelData.length > 1) {
    const sampleRow = excelData[1] || [];
    for (let i = 0; i < sampleRow.length; i++) {
      const val = safeStr(sampleRow[i]);
      if (isImageValue(val)) {
        frontendColIndex = i;
        break;
      }
    }
    if (frontendColIndex !== -1) {
      for (let i = 0; i < sampleRow.length; i++) {
        if (i !== frontendColIndex && isImageValue(safeStr(sampleRow[i]))) {
          if (!backendColIndices.includes(i)) backendColIndices.push(i);
        }
      }
    }
  }

  return {
    skuColIndex,
    titleColIndex,
    materialColIndex,
    includesColIndex,
    categoryColIndex,
    frontendColIndex,
    backendColIndices
  };
}

// Ultra-Fast SKU & Image List Builder (Optimized for 5 Lac / 500,000 AKUs)
export function buildImageListFromExcelData(excelData: (string | number)[][]): ParseResult {
  const {
    skuColIndex,
    titleColIndex,
    materialColIndex,
    includesColIndex,
    categoryColIndex,
    frontendColIndex,
    backendColIndices
  } = detectColumns(excelData);

  const imageDataList: ImageItem[] = [];
  let globalIdCounter = 0;
  const rowCount = excelData.length;

  for (let r = 1; r < rowCount; r++) {
    const row = excelData[r];
    if (!row) continue;

    const skuRaw = row[skuColIndex] !== undefined ? String(row[skuColIndex]).trim() : '';
    const sku = skuRaw || `SKU-${r}`;
    const title = titleColIndex >= 0 && row[titleColIndex] !== undefined ? String(row[titleColIndex]) : '';
    const material = materialColIndex >= 0 && row[materialColIndex] !== undefined ? String(row[materialColIndex]) : '';
    const includes = includesColIndex >= 0 && row[includesColIndex] !== undefined ? String(row[includesColIndex]) : '';
    const category = categoryColIndex >= 0 && row[categoryColIndex] !== undefined ? String(row[categoryColIndex]) : '';

    let imgNo = 0;
    let rowHadClassifiedImage = false;

    // Frontend Image Column
    if (frontendColIndex >= 0 && row[frontendColIndex] !== undefined) {
      const cellVal = String(row[frontendColIndex]).trim();
      if (isImageValue(cellVal)) {
        imgNo++;
        rowHadClassifiedImage = true;
        imageDataList.push({
          id: globalIdCounter++,
          rowIdx: r,
          colIdx: frontendColIndex,
          sku,
          imgNo,
          link: cellVal,
          originalLink: cellVal,
          deleted: false,
          isFrontend: true,
          title,
          material,
          includes,
          category
        });
      }
    }

    // Backend Image Columns
    for (let k = 0; k < backendColIndices.length; k++) {
      const colIdx = backendColIndices[k];
      if (row[colIdx] !== undefined) {
        const cellVal = String(row[colIdx]).trim();
        if (isImageValue(cellVal)) {
          imgNo++;
          rowHadClassifiedImage = true;
          imageDataList.push({
            id: globalIdCounter++,
            rowIdx: r,
            colIdx,
            sku,
            imgNo,
            link: cellVal,
            originalLink: cellVal,
            deleted: false,
            isFrontend: false,
            title,
            material,
            includes,
            category
          });
        }
      }
    }

    // General fallback if no classified columns matched this row
    if (!rowHadClassifiedImage) {
      let isFirstImageInRow = true;
      for (let c = 0; c < row.length; c++) {
        const cellRaw = row[c];
        if (cellRaw !== undefined) {
          const cellVal = String(cellRaw).trim();
          if (isImageValue(cellVal)) {
            imgNo++;
            imageDataList.push({
              id: globalIdCounter++,
              rowIdx: r,
              colIdx: c,
              sku,
              imgNo,
              link: cellVal,
              originalLink: cellVal,
              deleted: false,
              isFrontend: isFirstImageInRow,
              title,
              material,
              includes,
              category
            });
            isFirstImageInRow = false;
          }
        }
      }
    }
  }

  return {
    excelData,
    imageDataList,
    skuColIndex,
    frontendColIndex,
    backendColIndices
  };
}

// Fast Generator for Large Demo Datasets (e.g. 5,000 to 500,000 SKUs)
export function generateDemoDataset(rowCount: number = 5000): ParseResult {
  const headers = ['SKU', 'Title', 'Category', 'Material', 'Package Includes', 'Image Path', '1', '2', '3', '4'];
  const excelData: (string | number)[][] = new Array(rowCount + 1);
  excelData[0] = headers;

  const categories = ['Home & Kitchen', 'Electronics', 'Apparel & Fashion', 'Sports & Outdoors', 'Beauty & Personal Care', 'Jewelry'];
  const materials = ['100% Pure Cotton', 'Stainless Steel 304', 'Genuine Leather', 'Anodized Aluminum', 'BPA-Free Silicone', 'Tempered Glass'];
  const products = ['Wireless Earbuds', 'Coffee Maker Pro', 'Yoga Mat Ultra', 'Smart Watch Series X', 'Stainless Steel Flask', 'Ergonomic Desk Chair', 'Ceramic Dinnerware Set', 'Leather Wallet Slim'];

  const sampleImages = [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80'
  ];

  for (let i = 1; i <= rowCount; i++) {
    const cat = categories[i % categories.length];
    const mat = materials[i % materials.length];
    const prod = products[i % products.length];
    const sku = `AMZ-${100000 + i}`;
    const title = `Premium ${prod} - High Performance Edition ${i}`;
    const includes = `1x ${prod}, 1x User Manual, 1x Warranty Card`;

    const mainImg = sampleImages[(i - 1) % sampleImages.length];
    const img1 = sampleImages[i % sampleImages.length];
    const img2 = sampleImages[(i + 1) % sampleImages.length];
    const img3 = sampleImages[(i + 2) % sampleImages.length];
    const img4 = sampleImages[(i + 3) % sampleImages.length];

    excelData[i] = [sku, title, cat, mat, includes, mainImg, img1, img2, img3, img4];
  }

  return buildImageListFromExcelData(excelData);
}

// Synchronize all image edits and deletions into the Excel 2D array
export function applyChangesToExcelData(
  excelData: (string | number)[][],
  imageDataList: ImageItem[],
  markedForDelete: Set<number>
): (string | number)[][] {
  if (!excelData || excelData.length === 0) return [];

  // Deep clone 2D matrix
  const newData = excelData.map(row => (row ? [...row] : []));

  // Sync image links and handle deletions
  imageDataList.forEach(item => {
    if (item.rowIdx < newData.length && newData[item.rowIdx]) {
      if (markedForDelete.has(item.id) || item.deleted) {
        newData[item.rowIdx][item.colIdx] = '';
      } else if (item.link !== undefined) {
        newData[item.rowIdx][item.colIdx] = item.link;
      }
    }
  });

  return newData;
}

// Pre-defined ExcelJS Cell Fill Style (Reused across rows for maximum memory & export speed)
const YELLOW_FILL_STYLE: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFFF00' }
};

// High-Speed Excel Exporter with Yellow Row Highlights
export async function downloadExcelWithHighlights(
  excelData: (string | number)[][],
  highlightedRows: Set<number>,
  filename: string = 'amazon_images_updated.xlsx'
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Amazon Images');

  const rowCount = excelData.length;

  for (let rIdx = 0; rIdx < rowCount; rIdx++) {
    const row = excelData[rIdx];
    if (!row) continue;

    const wsRow = worksheet.addRow(row);

    // Apply yellow background ONLY to highlighted rows (skip header row 0)
    if (rIdx > 0 && highlightedRows.has(rIdx)) {
      wsRow.eachCell((cell) => {
        cell.fill = YELLOW_FILL_STYLE;
      });
    }
  }

  // Header row formatting
  const headerRow = worksheet.getRow(1);
  if (headerRow) {
    headerRow.font = { bold: true };
    headerRow.height = 22;
  }

  worksheet.columns.forEach(col => {
    col.width = 24;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
