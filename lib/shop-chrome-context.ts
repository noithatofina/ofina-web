/**
 * Types + helpers cho shop chrome (Header/Footer/FloatingActions) nhận settings từ CMS.
 * Fetch ở root layout (server), pass xuống client components qua props.
 */

export type Topbar = { messages: string[] }

export type ContactInfo = {
  hotline: string
  email: string
  zalo_url: string
  facebook_url: string
  working_hours?: string
}

export type Branch = {
  name: string
  address: string
  phone?: string
  maps_query?: string
}

export type Branding = {
  logo_url?: string
  favicon_url?: string
  og_image_url?: string
}

export type ShopChromeSettings = {
  topbar?: Topbar
  contact?: ContactInfo
  branches?: Branch[]
  branding?: Branding
}
