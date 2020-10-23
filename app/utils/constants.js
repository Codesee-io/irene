const CONSTANTS = {
  ANDROID_STORE_URL_RE: /(http(s?):\/\/play.google.com\/store\/apps\/details\?id=([A-Za-z].*))|(market:\/\/[A-Za-z].*)/,
  WINDOWS_STORE_URL_RE: /microsoft.com(.*)store\/p\/(.*)\/(.*)/
};

export const REPORT = {
  MAX_LIMIT: 2,
  STATUS: {
    GENERATING: 'Generating',
    GENERATED: 'Generated',
    GENERATE: 'Generate'
  },
  TYPE: {
    PDF: 'pdf',
    EXCEL: 'xlsx',
    JSON: 'json'
  }
}

export default CONSTANTS;
