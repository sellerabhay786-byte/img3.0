export interface ImageItem {
  id: number;            // Unique global index in imageDataList
  rowIdx: number;        // Excel row index (1-based, where 0 is header)
  colIdx: number;        // Excel column index
  sku: string;
  imgNo: number;         // 1, 2, 3... order within product
  link: string;          // Current image URL/path
  originalLink: string;  // Original URL before editing
  deleted: boolean;      // Marked for deletion
  isFrontend: boolean;   // True if main/Image Path column, False if backend numbered column
  title?: string;
  material?: string;
  includes?: string;
  category?: string;
  isEditedLink?: boolean;
  isEditedMeta?: boolean;
}

export interface AppStats {
  totalRows: number;
  frontendCount: number;
  totalImages: number;
  markedDeleteCount: number;
  highlightedRowsCount: number;
  editedLinksCount: number;
}

export type FilterStatus = 'all' | 'frontend' | 'highlighted' | 'deleted' | 'edited' | 'broken';

export interface SavedState {
  highlightedRows: number[];
  markedForDelete: number[];
  editedLinks: { id: number; rowIdx: number; colIdx: number; newLink: string }[];
  scrollPosition: number;
  rowCount: number;
  timestamp: string;
}
