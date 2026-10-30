export type Place = {
  id: string;
  name: string;
  detail: string;
  phone: string;
  tel: string;
  source: string;
  sourceLabel: string;
  lat: number;
  lon: number;
};

export type Line = {
  name: string;
  number: string;
  href: string;
  note: string;
  source: string;
};

/** Published addresses, then a coordinate taken from OpenStreetMap for that address. */
export const places: Place[] = [
  {
    id: "powa",
    name: "POWA, Berea",
    detail:
      "64 Mitchell Street, Berea, Johannesburg. The pin is Mitchell Street itself, from the published address.",
    phone: "011 591 6803",
    tel: "tel:0115916803",
    source: "https://www.powa.co.za/contact/",
    sourceLabel: "POWA",
    lat: -26.1820449,
    lon: 28.050821,
  },
  {
    id: "rapecrisis",
    name: "Rape Crisis Cape Town Trust",
    detail: "23 Trill Road, Observatory. Office line below. Counselling 021 447 9762.",
    phone: "021 447 1467",
    tel: "tel:0214471467",
    source: "https://rapecrisis.org.za/contact/",
    sourceLabel: "Rape Crisis",
    lat: -33.9395267,
    lon: 18.4673489,
  },
];

export const lines: Line[] = [
  {
    name: "GBV Command Centre",
    number: "0800 428 428",
    href: "tel:0800428428",
    note: "Social workers, day and night, in all official languages.",
    source: "https://www.justice.gov.za/vg/GBV.html",
  },
  {
    name: "Please call me",
    number: "*120*7867#",
    href: "tel:*120*7867%23",
    note: "A free callback request to the Command Centre.",
    source: "https://www.dsd.gov.za/",
  },
  {
    name: "SMS help",
    number: "31531",
    href: "sms:31531?body=HELP",
    note: "Text HELP. A written line, including for people with disabilities.",
    source: "https://www.justice.gov.za/vg/GBV.html",
  },
  {
    name: "SAPS",
    number: "10111",
    href: "tel:10111",
    note: "Police emergencies.",
    source: "https://www.saps.gov.za/",
  },
  {
    name: "Ambulance",
    number: "10177",
    href: "tel:10177",
    note: "Emergency medical services.",
    source: "https://www.gov.za/",
  },
  {
    name: "Childline",
    number: "116",
    href: "tel:116",
    note: "For a child.",
    source: "https://www.childlinesa.org.za/",
  },
];

export const STOP_NCII = "https://stopncii.org/";
