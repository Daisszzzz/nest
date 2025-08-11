export function getLabelByValue(
  arr: {
    label: string
    value: string | number | boolean
  }[],
  value: string | number | boolean,
): string {
  const item = arr.find((item) => item.value === value)
  return item ? item.label : ''
}
// Button permissions
export const ButtonPermission = {
  SysUser: {
    List: 'btn.sysUser.list',
    Add: 'btn.sysUser.add',
    Update: 'btn.sysUser.update',
    Remove: 'btn.sysUser.remove',
    AssignRole: 'btn.sysUser.assignRole',
  },
  SysRole: {
    List: 'btn.sysRole.list',
    Add: 'btn.sysRole.add',
    Update: 'btn.sysRole.update',
    Remove: 'btn.sysRole.remove',
    AssignAuth: 'btn.sysRole.assignAuth',
  },
  SysMenu: {
    List: 'btn.sysMenu.list',
    Add: 'btn.sysMenu.add',
    Update: 'btn.sysMenu.update',
    Remove: 'btn.sysMenu.remove',
  },
  SysPost: {
    List: 'btn.sysPost.list',
    Add: 'btn.sysPost.add',
    Update: 'btn.sysPost.update',
    Remove: 'btn.sysPost.remove',
  },
  Apartment: {
    Apartment: {
      List: 'btn.apartment.list',
      Add: 'btn.apartment.add',
      Update: 'btn.apartment.update',
      Remove: 'btn.apartment.remove',
    },
    Room: {
      List: 'btn.room.list',
      Add: 'btn.room.add',
      Update: 'btn.room.update',
      Remove: 'btn.room.remove',
    },
    Attribute: {
      Facility: {
        List: 'btn.facility.list',
        Add: 'btn.facility.add',
        Update: 'btn.facility.update',
        Remove: 'btn.facility.remove',
      },
      Label: {
        List: 'btn.label.list',
        Add: 'btn.label.add',
        Update: 'btn.label.update',
        Remove: 'btn.label.remove',
      },
      RoomInfo: {
        List: 'btn.roomInfo.list',
        Add: 'btn.roomInfo.add',
        Update: 'btn.roomInfo.update',
        Remove: 'btn.roomInfo.remove',
        AddNewItem: 'btn.roomInfo.AddNewItem',
      },
      Fee: {
        List: 'btn.fee.list',
        Add: 'btn.fee.add',
        Update: 'btn.fee.update',
        Remove: 'btn.fee.remove',
        AddNewItem: 'btn.fee.AddNewItem',
      },
      Term: {
        List: 'btn.agreement.list',
        Add: 'btn.agreement.add',
        Update: 'btn.agreement.update',
        Remove: 'btn.agreement.remove',
      },
      Payment: {
        List: 'btn.payment.list',
        Add: 'btn.payment.add',
        Update: 'btn.payment.update',
        Remove: 'btn.payment.remove',
      },
    },
  },
  Rent: {
    Appointment: {
      List: 'btn.appointment.list',
      TakeLook: 'btn.appointment.TakeLook',
    },
    Term: {
      List: 'btn.agreement.list',
      Add: 'btn.agreement.add',
      Update: 'btn.agreement.update',
      Remove: 'btn.agreement.remove',
      CancelTerm: 'btn.agreement.cancelTerm',
      ConfirmReturnRent: 'btn.agreement.confirmReturnRent',
      ConfirmRenew: 'btn.agreement.confirmRenew',
    },
  },
  User: {
    List: 'btn.user.list',
    Update: 'btn.user.update',
  },
}
// Apartment release status
export enum ApartmentReleaseStatus {
  NOT_RELEASED = 0,
  RELEASED = 1,
}
export const ApartmentReleaseStatusMap = [
  { label: 'Unreleased', value: ApartmentReleaseStatus.NOT_RELEASED },
  { label: 'Released', value: ApartmentReleaseStatus.RELEASED },
]
// Room release status
export enum RoomReleaseStatus {
  NOT_RELEASED = 0,
  RELEASED = 1,
}
export const RoomReleaseStatusMap = [
  { label: 'Unreleased', value: RoomReleaseStatus.NOT_RELEASED },
  { label: 'Released', value: RoomReleaseStatus.RELEASED },
]
// Room check-in status
export const RoomCheckInStatus = {
  NOT_CHECK_IN: false,
  CHECK_IN: true,
} as const
export const RoomCheckInStatusMap = [
  { label: 'Not Checked In', value: RoomCheckInStatus.NOT_CHECK_IN },
  { label: 'Checked In', value: RoomCheckInStatus.CHECK_IN },
]
// type: 'Apartment' | 'Room'
export enum BuildingType {
  APARTMENT = 1,
  ROOM = 2,
}
export const BuildingTypeTypeMap = [
  { label: 'Apartment', value: BuildingType.APARTMENT },
  { label: 'Room', value: BuildingType.ROOM },
]
// Appointment status, values: 1,2,3,4
export enum AppointmentStatus {
  WAITING = 1,
  CANCELLED = 2,
  VIEWED = 3,
  EXPIRED = 4,
}
export const AppointmentStatusMap = [
  { label: 'Waiting for Viewing', value: AppointmentStatus.WAITING },
  { label: 'Cancelled', value: AppointmentStatus.CANCELLED },
  { label: 'Viewed', value: AppointmentStatus.VIEWED },
  { label: 'Expired', value: AppointmentStatus.EXPIRED },
]
// Agreement status, values: 1,2,3,4,5,6,7
export enum AgreementStatus {
  WAITING = 1,
  SIGNED = 2,
  CANCELLED = 3,
  EXPIRED = 4,
  TO_BE_CONFIRMED = 5,
  CONFIRMED = 6,
  RENEW_TO_BE_CONFIRMED = 7,
}
export const AgreementStatusMap = [
  { label: 'Signing to be Confirmed', value: AgreementStatus.WAITING },
  { label: 'Signed', value: AgreementStatus.SIGNED },
  { label: 'Cancelled', value: AgreementStatus.CANCELLED },
  { label: 'Expired', value: AgreementStatus.EXPIRED },
  { label: 'Termination to be Confirmed', value: AgreementStatus.TO_BE_CONFIRMED },
  { label: 'Terminated', value: AgreementStatus.CONFIRMED },
  { label: 'Renewal to be Confirmed', value: AgreementStatus.RENEW_TO_BE_CONFIRMED },
]
// Agreement source, values: 1,2
export enum AgreementSource {
  NEW = 1,
  RENEW = 2,
}
export const AgreementSourceMap = [
  { label: 'New', value: AgreementSource.NEW },
  { label: 'Renewal', value: AgreementSource.RENEW },
]
// User account status "0": "Disabled","1": "Active"
export enum UserStatus {
  DISABLED = 0,
  NORMAL = 1,
}
export const UserStatusMap = [
  { label: 'Disabled', value: UserStatus.DISABLED },
  { label: 'Active', value: UserStatus.NORMAL },
]
// System user type "0": "Admin","1": "Normal User"
export enum SystemUserType {
  ADMIN = 0,
  NORMAL = 1,
}
export const SystemUserTypeMap = [
  { label: 'Admin', value: SystemUserType.ADMIN },
  { label: 'Normal User', value: SystemUserType.NORMAL },
]
// System user status  "0": "Disabled","1": "Active"
export enum SystemUserStatus {
  DISABLED = 0,
  NORMAL = 1,
}
export const SystemUserStatusMap = [
  { label: 'Disabled', value: SystemUserStatus.DISABLED },
  { label: 'Active', value: SystemUserStatus.NORMAL },
]
