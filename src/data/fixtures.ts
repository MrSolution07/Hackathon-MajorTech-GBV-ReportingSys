export const reports = [
  { id: "1", type: "Harassment", when: "Today, 6:12 PM", status: "In Progress" as const },
  { id: "2", type: "Unsafe Spot", when: "Yesterday, 8:40 PM", status: "Resolved" as const },
  { id: "3", type: "Broken Streetlight", when: "7 Aug 2025, 2:18 PM", status: "Resolved" as const },
  { id: "4", type: "Harassment", when: "5 Aug 2025, 9:24 AM", status: "Resolved" as const },
];

export const bookings = [
  { id: "1", title: "Gautrain - Park Station", when: "Today • 8:24 AM", status: "Confirmed" },
  { id: "2", title: "Minibus Taxi", when: "Today • 5:30 PM", status: "Confirmed" },
  { id: "3", title: "Bus - Rosebank", when: "Tomorrow • 7:10 AM", status: "Confirmed" },
];

export const matches = {
  thandi: {
    id: "thandi",
    name: "Thandi",
    dest: "Going to Rosebank",
    leaves: "Leaves 6:45 PM",
    detailLeaves: "Leaves 6:46 PM",
    away: "3.1 km away",
    share: "Shared route • 60% match",
    meet: "Meet at the main taxi rank (near the station).",
    meetShort: "Meet at taxi rank • 6:45 PM",
  },
  zanele: {
    id: "zanele",
    name: "Zanele",
    dest: "Going to Rosebank",
    leaves: "Leaves 7:10 PM",
    detailLeaves: "Leaves 7:10 PM",
    away: "2.4 km away",
    share: "Shared route • 48% match",
    meet: "Meet at the station entrance.",
    meetShort: "Meet at station • 7:10 PM",
  },
} as const;

export type MatchId = keyof typeof matches;

export const languages = ["English", "isiZulu", "Sesotho", "Afrikaans", "Setswana"] as const;

export const incidentTypes = [
  { id: "harassment", label: "Harassment" },
  { id: "spot", label: "Unsafe Spot" },
  { id: "light", label: "Broken Streetlight" },
  { id: "other", label: "Other" },
] as const;

export const transports = [
  { id: "taxi", title: "Minibus Taxi", meta: "3 min • 0.2 km" },
  { id: "train", title: "Gautrain", meta: "9 min • 0.8 km" },
  { id: "bus", title: "Bus Stop", meta: "5 min • 0.4 km" },
] as const;
