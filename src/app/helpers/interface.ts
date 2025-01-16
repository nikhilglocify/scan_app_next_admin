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
