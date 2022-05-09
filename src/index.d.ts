interface CONFIG {
  API_URI: string;
  VERSION: string;
  BASENAME: string;
}

declare module "ctrack_config" {
  declare const CONFIG: CONFIG;
  export default CONFIG;
}
