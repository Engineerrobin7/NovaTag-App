export const APP_NAME = 'NovaTag';
export const COMPANY_NAME = 'InfyNova';
export const APP_TAGLINE = 'Find what matters.';
export const APP_VERSION = '1.0.0';

export const PRIVACY_POLICY_URL = 'https://infynova.com/privacy'; // TODO: Replace
export const TERMS_URL = 'https://infynova.com/terms'; // TODO: Replace
export const SUPPORT_URL = 'https://infynova.com/support'; // TODO: Replace

/** Enable mock BLE mode — set to false when real hardware is available */
export const MOCK_MODE_DEFAULT = true;

export const STORAGE_KEYS = {
  SAVED_TRACKERS: 'novatag_saved_trackers',
  SETTINGS: 'novatag_settings',
  ONBOARDING_COMPLETE: 'novatag_onboarding_complete',
  MOCK_MODE: 'novatag_mock_mode',
} as const;

export const TRACKER_METADATA_KEYS = {
  LAST_CONNECTED: 'lastConnected',
  LAST_DISCONNECTED: 'lastDisconnected',
  LAST_RSSI: 'lastRssi',
  CUSTOM_NAME: 'customName',
} as const;
