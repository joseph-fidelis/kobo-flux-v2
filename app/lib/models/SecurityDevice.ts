import type { ArmoryLocationResponse } from './ArmoryLocation'
import type { EnumResponse, PaginatedResponse } from './util'

export enum SecurityDeviceType {
  CCTV_CAMERA         = 'cctv_camera',
  PTZ_CAMERA          = 'ptz_camera',
  DOME_CAMERA         = 'dome_camera',
  BULLET_CAMERA       = 'bullet_camera',
  THERMAL_CAMERA      = 'thermal_camera',
  BODY_CAMERA         = 'body_camera',
  BIOMETRIC_SCANNER   = 'biometric_scanner',
  ACCESS_CARD_READER  = 'access_card_reader',
  KEYPAD_LOCK         = 'keypad_lock',
  ELECTRONIC_LOCK     = 'electronic_lock',
  TURNSTILE           = 'turnstile',
  METAL_DETECTOR      = 'metal_detector',
  EXPLOSIVE_DETECTOR  = 'explosive_detector',
  MOTION_SENSOR       = 'motion_sensor',
  PERIMETER_SENSOR    = 'perimeter_sensor',
  GLASS_BREAK_SENSOR  = 'glass_break_sensor',
  RADIO               = 'radio',
  INTERCOM            = 'intercom',
  PANIC_BUTTON        = 'panic_button',
  GPS_TRACKER         = 'gps_tracker',
  BODY_ARMOR          = 'body_armor',
  HELMET              = 'helmet',
  SHIELD              = 'shield',
  HANDCUFFS           = 'handcuffs',
  BATON               = 'baton',
  PATROL_VEHICLE      = 'patrol_vehicle',
  ARMORED_VEHICLE     = 'armored_vehicle',
  SAFE                = 'safe',
  VAULT_DOOR          = 'vault_door',
  ALARM_SYSTEM        = 'alarm_system',
  NVG                 = 'nvg',
  DRONE               = 'drone',
}

export interface SecurityDeviceCreate {
  barcode: number
  type: SecurityDeviceType
  model: string
  serial_no: string
  estimated_cost: string
  condition: string
  availability: string
  is_locked: boolean
  image_url: string | null
  armory_location_id: string | null
}

export type SecurityDeviceUpdate = Partial<SecurityDeviceCreate>

export interface SecurityDeviceResponse {
  id: string
  barcode: number
  type: SecurityDeviceType
  model: string
  serial_no: string
  estimated_cost: string
  condition: string 
  availability: string
  is_locked: boolean
  image_url: string | null
  armory_location_id: string | null
  armory_location: ArmoryLocationResponse | null
  created_at: string
  updated_at: string
}

export interface SecurityDeviceListResponse extends PaginatedResponse<SecurityDeviceResponse> {}
