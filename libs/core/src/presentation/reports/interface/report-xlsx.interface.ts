interface IHeadersOption {
  filename: string;
  sheet_name: string;
  headers: string[];
  topic: string;
  authorized_by: string;
}

export interface IBuildXLSX {
  option: IHeadersOption;
  data: string[][];
}
