interface IHeadersOption {
  filename: string;
  sheet_name: string;
  headers: string[];
}

export interface IBuildXLSX {
  option: IHeadersOption;
  data: string[][];
}
