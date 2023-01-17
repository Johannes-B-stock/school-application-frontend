export interface BaseData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArrayMeta {
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface SingleDataResponse<T> {
  data?: T;
  meta?: object;
  error?: ApiError;
}

export interface ApiError {
  message?: string;
  status?: number;
  name?: string;
  details?: object;
}

export interface ArrayDataResponse<T> {
  data?: T[];
  meta?: ArrayMeta;
  error?: ApiError;
}

export interface LocaleInfo {
  locale: string;
}

export interface Localization<T> extends LocaleInfo {
  localizations?: T[];
}

export interface Formats {
  small?: Format;
  thumbnail: Format;
  large?: Format;
}

export interface Format {
  url: string;
  width?: string;
  height?: string;
}

export interface Image extends BaseData {
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  url?: string;
  formats: Formats;
}
