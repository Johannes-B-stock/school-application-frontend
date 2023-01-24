import { User, Address } from "api-definitions/backend";

export function getMainAddress(user: User | undefined): Address | undefined {
  return user?.addresses?.find((address) => address.type === "main");
}

export function getEmergencyAddress(
  user: User | undefined
): Address | undefined {
  return user?.addresses?.find((address) => address.type === "emergency");
}
