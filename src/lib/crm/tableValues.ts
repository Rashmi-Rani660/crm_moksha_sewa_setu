import { humanize, shortDate, shortDateTime } from "@/lib/format";
import { at, EMPTY, money, records, text, type CrmRecord } from "./data";

/** Explicit response-field mappings; unmatched UI columns remain empty instead of guessing data. */
const paths: Record<string, string[]> = {
  id: ["requestNo", "caseNo", "taskNo", "volunteerNo", "registrationNo", "driverNo", "partnerNo", "approvalNo", "auditNo", "crmId", "code", "id"],
  name: ["name", "title"], member: ["name", "crmId"], "member id": ["crmId", "volunteerNo"],
  "request id": ["requestNo"], "case id": ["caseNo"], "task id": ["taskNo"], "user id": ["crmId"],
  "volunteer id": ["volunteerNo"], volunteer: ["name"], "vehicle id": ["registrationNo"], vehicle: ["registrationNo", "vehicle.registrationNo"],
  registration: ["registrationNo"], "vehicle / type": ["registrationNo"], "driver id": ["driverNo"], driver: ["driver.name", "name"],
  "partner id": ["partnerNo"], partner: ["name"], "service partner": ["name"],
  request: ["requestNo", "title", "summary"], task: ["taskNo", "title"], title: ["title", "name"],
  "task / linked case": ["title"], "task / activity": ["title"], work: ["title", "reference"],
  "assigned work": ["reference"], "linked case": ["case.caseNo", "reference"], "linked request": ["requestNo"],
  category: ["beneficiaryCategory", "category", "categoryCode"], "beneficiary category": ["beneficiaryCategory"],
  area: ["area", "location.area"], "facility type": ["type"], facility: ["name"],
  "assigned driver": ["driver.name"], case: ["case.caseNo", "caseNo", "reference"], trip: ["tripNo"],
  "pickup area": ["pickup.area", "pickup.address"], eta: ["eta"],
  "available": ["quantity", "totalOnHand"], reorder: ["item.reorderLevel", "reorderLevel"],
  "last service": ["lastServiceAt"], "next service": ["nextServiceDueAt"],
  capacity: ["capacityPerDay"], "cost terms": ["costTerms"], agreement: ["title"],
  amount: ["total", "cost", "costs.total"], cost: ["cost", "total"], "total cost": ["costs.total", "total"],
  "gps update": ["lastLocation.at", "location.at"], mileage: ["distanceKm"], "fuel / toll": ["costs.total"],
  movement: ["type"], "case / reference": ["reference", "caseId"], "recorded by": ["actor.name"],
  accuracy: ["location.accuracy"], "licence check": ["licence.state"], duty: ["onDuty"],
  "hours (month)": ["hoursThisMonth"], "preferred area": ["area"], "emergency contact": ["emergencyContact.name"],
  beneficiary: ["beneficiaryCategory", "beneficiary.deceasedName"], source: ["channel"], channel: ["channel"],
  owner: ["owner.name"], "assigned owner": ["owner.name"], assignee: ["assignee.name", "name"],
  user: ["name", "userName"], "requested by": ["requestedBy.name", "requestedBy"], maker: ["requestedBy.name"],
  approver: ["decidedBy.name", "requiredLevel"], checker: ["decidedBy.name"],
  centre: ["centre.name"], city: ["location.city", "beneficiary.city"], locality: ["location.area", "area"],
  location: ["location.address", "area", "beneficiary.area"], "pickup locality": ["pickup.area"],
  department: ["department.name"], "reporting admin": ["reportingTo.name"],
  type: ["type", "typeCode", "kind", "accessLevel"], service: ["typeCode", "purpose"],
  priority: ["priority"], status: ["status", "stage", "state"], stage: ["stage", "status"],
  "access level": ["accessLevel"], role: ["role.name", "preferredRole"], availability: ["availability", "state"],
  training: ["trainingStatus"], skill: ["preferredRole"], skills: ["skills"],
  mobile: ["mobileMasked", "requester.mobileMasked"], contact: ["mobileMasked", "contact.phone"],
  item: ["item.name", "name"], material: ["item.name", "name"], "item code": ["item.code", "code"],
  quantity: ["quantity"], "in stock": ["quantity", "totalOnHand"], stock: ["quantity", "totalOnHand"],
  "on hand": ["quantity", "totalOnHand"], "available qty": ["quantity"], "min. stock": ["item.reorderLevel", "reorderLevel"],
  unit: ["item.unit", "unit"], "reorder level": ["item.reorderLevel", "reorderLevel"],
  vendor: ["vendor"], purpose: ["purpose", "justification"], reference: ["reference", "requestNo"],
  time: ["at", "startAt", "createdAt"], date: ["day", "date", "createdAt"], due: ["dueAt"],
  "last update": ["updatedAt", "location.at"], "last activity": ["lastUsedAt"],
  "last gps": ["location.at"], "safety check-in": ["safetyAt"], consent: ["sharingLocation"],
  "check-in": ["checkInAt"], "check-out": ["checkOutAt"], "start time": ["startAt"],
  "document / evidence": ["title", "docType"], document: ["title", "docType"], verification: ["verification.state"],
  expiry: ["licence.validTo", "endDate", "nextServiceDueAt"], "agreement status": ["state"],
  action: [],
};

export function tableValue(column: string, row: CrmRecord): string {
  const key = column.toLowerCase().trim();
  if (key === "action") return "View";
  if (key === "status" && row.needsHelp) return "Need help";
  if (key === "status" && row.stale) return "Stale";
  if (key === "verification" && at(row,"idProof.verified") !== undefined) return at(row,"idProof.verified") ? "Verified" : "Pending";
  const candidates = paths[key];
  if (!candidates) return EMPTY;
  const value = candidates.map(path => at(row, path)).find(v => v !== undefined && v !== null);
  if (value === undefined) return EMPTY;
  if (["amount", "cost", "total cost", "fuel / toll"].includes(key)) return money(value);
  if (["time", "due", "last update", "last activity", "last gps", "safety check-in", "check-in", "check-out", "start time"].includes(key)) return shortDateTime(text(value, ""));
  if (["date", "expiry"].includes(key)) return shortDate(text(value, ""));
  if (Array.isArray(value)) return value.map(item => typeof item === "string" ? item : text(at(item,"name"))).join(" / ") || EMPTY;
  if (["status", "stage", "priority", "source", "channel", "type", "category", "beneficiary", "access level", "availability", "training", "verification"].includes(key)) return humanize(text(value, ""));
  return text(value);
}

export function tableRows(columns: string[], data: unknown): string[][] {
  return records(data).map(row => columns.map(column => tableValue(column, row)));
}
