export enum Channel {
  CHAT = 'CHANNEL_CHAT',
  VOICE = 'CHANNEL_VOICE',
}

export enum Locale {
  EN = 'en',
  DE = 'de',
}

export interface ChannelContext {
  channel: Channel;
  locale: Locale;
}
