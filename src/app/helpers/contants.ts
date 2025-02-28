import { MenuItem } from "./interface";


export const navBarFields: MenuItem[] = [
  {
    name: "Home",
    route: "/dashboard",
    dropdownOptions: [

    ],
    showDropdown: false,
  },
  {
    name:"Items", route: "/tips/", dropdownOptions: [


    ], showDropdown: false
  },
  {
    name: "File", route: "/upload-url/", dropdownOptions: [


    ], showDropdown: false
  },
  // {
  //   name: "upload",
  //   route: "/video/upload",
  //   dropdownOptions: [],
  //   showDropdown: false,
  // },
  { name: "Logout", route: "#", dropdownOptions: [], showDropdown: false },
];



export enum routeConstants {

  DASHBOARD="/dashboard",
  SIGN_UP= "/sign-up",
  SIGN_IN= "/sign-in",
  VIDEO_LIST= "/video/list",
  VIDEO_UPLOAD= "/video/upload",
  VIDEO_DETAILS= "/video/details/:id",
  FORGOT_PASSWORD= "/forgot-password",
  RESET_PASSWORD="/reset-password/:token",

}