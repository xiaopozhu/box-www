export interface hashInfo {
  encoding: "plaintext" | "hex" | "base32" | "base64" | "unicode" | "url";
  hash: string;
  bytes: string;
}

export interface codecInfo {
  encoding: "plaintext" | "hex" | "base32" | "base64" | "unicode" | "url";
  text: string;
  bytes: string;
}

export interface ipInfo {
  ip: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  timeZone: string;
  latitude: number;
  longtitude: number;
}
