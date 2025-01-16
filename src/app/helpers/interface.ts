import { Readable } from 'stream';
export interface DropdownOption {
  name: string;
  route: string;
}

export interface MenuItem {
  name: string;
  route: string;
  dropdownOptions?: DropdownOption[]; // Optional as not all items may have a dropdown
  showDropdown: boolean;
}


export interface urlFile {

  term: []

}



export interface ExtendedReadable extends Readable {
    headers?: Record<string, string>;
    method?: string;
    url?: string;
}
