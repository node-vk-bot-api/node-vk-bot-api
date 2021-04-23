// Type definitions for node-vk-bot-api 3.4.0
// Definitions by: kapturoff, https://github.com/kapturoff

type VkBotMiddleware = (ctx: VkBotContext, next?: () => any) => any

//-------------------------//
// Interfaces for settings //
//-------------------------//

interface VkBotSettings {
  token: string
  group_id?: number
  execute_timeout?: number
  polling_timeout?: number
  secret?: string
  confirmation?: string
}

interface VkBotSessionSettings {
  store?: object
  key?: string
  getSessionKey?(middleware: VkBotMiddleware)
}

//-----------------------//
// Additional interfaces //
//-----------------------//

interface VkBotAttachment {
  type:
    | 'photo'
    | 'video'
    | 'audio'
    | 'doc'
    | 'link'
    | 'market'
    | 'market_album'
    | 'wall'
    | 'wall_reply'
    | 'sticker'
    | 'gift'

  /** if type is photo */
  photo?: VkBotPhoto

  /** if type is video */
  video?: VkBotVideo

  /** if type is audio */
  audio?: VkBotAudio

  /** if type is doc */
  doc?: VkBotDoc

  /** if type is link */
  link?: VkBotLink

  /** if type is market */
  market?: VkBotMarket

  /** if type is market_album */
  market_album?: VkBotMarketAlbum

  /** if type is wall */
  wall?: VkBotWall

  /** if type is wall_reply */
  wall_reply?: VkBotComment

  /** if type is sticker */
  sticker?: VkBotSticker

  /** if type is gift */
  gift?: VkBotGift
}

interface VkBotGeo {
  type: string
  coordinates: [number, number]
  place: {
    id: number
    title: string
    latitude: number
    longitude: number
    created?: number
    icon: string
    country: string
    city: string
  }
  showmap: boolean
}

interface VkBotWall {
  id: number
  owner_id: number
  from_id: number
  created_by: number
  date: number
  text: string
  reply_owner_id: number
  reply_post_id: number
  friends_only?: 1
  comments?: {
    count: number
    can_post: 0 | 1
    groups_can_post: 0 | 1
    can_close: boolean
    can_open: boolean
  }
  copyright?: {
    id: number
    link: string
    name: string
    type: string
  }
  likes: {
    count: number
    user_likes: 0 | 1
    can_like: 0 | 1
    can_publish: 0 | 1
  }
  reposts: {
    count: number
    user_reposted: 0 | 1
  }
  views: {
    count: number
  }
  post_type: string
  attachments?: VkBotAttachment[]
  geo: VkBotGeo
  signer_id?: number
  copy_history: VkBotWall[]
  can_pin?: 0 | 1
  can_delete?: 0 | 1
  can_edit?: 0 | 1
  is_pinned?: 1
  marked_as_ads: 0 | 1
  is_favorite: boolean
  postponed_id?: number
}

interface VkBotSticker {
  product_id: number
  sticker_id: number
  images?: VkBotPhoto[]
  images_with_background?: VkBotPhoto[]
  animation_url?: string
  is_allowed: boolean
}

interface VkBotGift {
  id: number
  thumb_256: string
  thumb_96: string
  thumb_48: string
}

interface VkBotDoc {
  id: number
  owner_id: number
  title: string
  date: number
  size: number
  ext: string
  url: string
  /**
   * - 1 - text
   * - 2 - archive
   * - 3 - gif
   * - 4 - image
   * - 5 - audio
   * - 6 - video
   * - 7 - e-book
   * - 8 - unknown
   */
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  preview: {
    photo?: {
      sizes: {
        height: number
        width: number
        type: string
        src: string
      }[]
    }
    graffiti?: {
      height: number
      width: number
      src: string
    }
    audio_message?: {
      duration: number
      waveform: number[]
      link_ogg: string
      link_mp3: string
    }
  }
}

interface VkBotMarket {
  id: number
  owner_id: number
  title: string
  description: string
  price: {
    amount: number
    currency: {
      id: number
      name: string
    }
    text: string
    old_amount: string
  }
  dimensions?: {
    width: number
    height: number
    length: string
  }
  weight?: number
  category: {
    id: number
    name: string
    section: {
      id: number
      name: string
    }
  }
  thumb_photo: string
  date: number
  availability: 0 | 1 | 2
  is_favorite?: boolean
  sku: string
}

interface VkBotMarketAlbum {
  id: number
  owner_id: number
  title: string
  description: string
  photo?: VkBotPhoto
  count: number
  updated_time: string
}

interface VkBotLink {
  url: string
  title: string
  caption?: string
  description: string

  product?: {
    price: {
      amount: number
      currency: {
        id: number
        name: string
      }
      text: string
    }
  }
  button?: {
    title: string
    action: {
      type: 'open_url'
      url: string
    }
  }
  preview_page: string
  preview_url: string
}

interface VkBotPhoto {
  id: number
  album_id: number
  owner_id: number
  user_id: number
  text: string
  date: number
  sizes: {
    type: string
    url: string
    width: number
    height: number
  }[]
  /** Field can be not set for photos that were uploaded before 2012 year */
  width?: number
  /** Field can be not set for photos that were uploaded before 2012 year */
  height?: number
}

interface VkBotVideo {
  id: number
  owner_id: number
  title: string
  description: string
  duration: number
  image: {
    height: number
    width: number
    url: string
    with_padding: number
  }[]
  first_frame: {
    height: number
    width: number
    url: string
  }[]
  date: number
  adding_time: number
  view: number
  local_views?: number
  comments?: number
  player: string
}

interface VkBotAudio {
  id: number
  owner_id: number
  title: string
  date: number
  artist: string
  duration: number
  lyrics_id?: number
  album_id?: number
  genre_id?: number
  no_search?: 1
  is_hq?: 1
}

interface VkBotComment {
  id: number
  from_id: number
  date: number
  text: string
  reply_to_user?: number
  reply_to_comment?: number
  attachments?: VkBotAttachment[]
  parent_stack: number[]
  thread: {
    count: number
    items?: VkBotComment[]
    can_post: boolean
    show_reply_button: boolean
    groups_can_post: boolean
  }
}

interface VkBotClientInfo {
  button_actions: string[]
  keyboard: boolean
  inline_keyboard: boolean
  carousel: boolean
  lang_id: number
}

//--------------------//
// Main functionality //
//--------------------//

interface VkBotMessage {
  id: number
  date: number
  peer_id: number
  from_id: number
  text?: string
  random_id?: number
  ref?: string
  ref_source?: string
  attachments?: VkBotAttachment[]
  important?: boolean
  geo?: VkBotGeo
  payload?: string
  keyboard?: VkBotKeyboard
  fwd_messages?: VkBotMessage[]
  reply_message?: VkBotMessage
  action?: {
    type:
      | 'chat_photo_update'
      | 'chat_photo_remove'
      | 'chat_create'
      | 'chat_title_update'
      | 'chat_invite_user'
      | 'chat_kick_user'
      | 'chat_pin_message'
      | 'chat_unpin_message'
      | 'chat_invite_user_by_link'
    member_id?: string | number
    text?: string
    email?: string
    photo: {
      photo_50: string
      photo_100: string
      photo_200: string
    }
  }
  admin_author_id?: number
  conversation_message_id?: number
  is_cropped?: boolean
  members_count?: number
  update_time?: number
  was_listened?: number
  pinned_at?: number
}

interface VkBotContext {
  message: VkBotMessage
  eventId: number
  groupId: number
  match?: RegExp
  /**
   * @deprecated
   */
  client_info?: VkBotClientInfo
  clientInfo?: VkBotClientInfo
  bot: VkBot
  reply(
    message: string,
    attachment?: string | string[],
    markup?: VkBotKeyboard,
    sticker?: number | string
  ): void
  /**
   * Only if Session middleware is used
   * @requires node-vk-bot-api/lib/session
   */
  session?: any
  /**
   * Only if Stage middleware is used
   * @requires node-vk-bot-api/lib/stage
   */
  scene?: {
    enter(name: string, step?: number)
    leave(): void
    next(): void
    selectStep(index: number)
  }
}

declare class VkBot {
  constructor(token: string)
  constructor(settings: VkBotSettings)

  sendMessage(
    userId: number | string,
    message: string,
    attachment?: string | string[],
    keyboard?: VkBotKeyboard,
    sticker?: number | string
  ): Promise<{
    peer_id: number
    message_id: number
    conversation_message_id: number
    error?: any
  }>

  execute(method: string, settings: any): Promise<any>

  use(middleware: VkBotMiddleware): void

  on(...middlewares: VkBotMiddleware[]): void

  command(triggers: string | string[], ...middlewares: VkBotMiddleware[]): this

  event(triggers: string, ...middlewares: VkBotMiddleware[]): void

  startPolling(callback?: (err: any) => {}): void

  webhookCallback(req: any, res: any, next?: () => {}): any

  webhookCallback(ctx: any, next?: () => {}): any

  stop(): this

  start(): this
}

declare module 'node-vk-bot-api' {
  export default VkBot
}

//----------------------//
// Markup functionality //
//----------------------//

interface VkBotButton {
  action: {
    type: 'text' | 'open_link' | 'location' | 'vkpay' | 'open_app' | 'callback'
    label?: string
    payload?: string
    link?: string
    hash?: string
    app_id?: number
    owner_id?: number
  }
  color: 'primary' | 'secondary' | 'negative' | 'positive'
}

interface VkBotKeyboard {
  buttons: VkBotButton[]
  inline(value?: boolean): this
  oneTime(value?: boolean): this
  toJSON(): string
}

declare class VkBotMarkup {
  static keyboard(
    buttons: VkBotButton[] | VkBotButton[][],
    options?: { columns: number }
  ): VkBotKeyboard

  static keyboard(buttons: string[] | string[][], options?: { columns: number }): VkBotKeyboard

  static button(
    label: string,
    color: 'primary' | 'secondary' | 'negative' | 'positive',
    payload?: any
  ): VkBotButton

  static button(settings: VkBotButton): VkBotButton

  inline(value?: boolean): this

  oneTime(value?: boolean): this

  toJSON(): string
}

declare module 'node-vk-bot-api/lib/markup' {
  export default VkBotMarkup
}

//-----------------------//
// Session functionality //
//-----------------------//

declare class VkBotSession {
  constructor(settings?: VkBotSessionSettings)

  middleware(): VkBotMiddleware
}

declare module 'node-vk-bot-api/lib/session' {
  export default VkBotSession
}

//---------------------//
// Scene functionality //
//---------------------//

declare class VkBotScene {
  constructor(name: string, ...middlewares: VkBotMiddleware[])
  command(_triggers: string[], ...middlewares: VkBotMiddleware[]): void
}

declare module 'node-vk-bot-api/lib/scene' {
  export default VkBotScene
}

//---------------------//
// Stage functionality //
//---------------------//

declare class VkBotStage {
  constructor(...scenes: VkBotScene[])
  enter(ctx: VkBotContext): any
  middleware(): VkBotMiddleware
}

declare module 'node-vk-bot-api/lib/stage' {
  export default VkBotStage
}