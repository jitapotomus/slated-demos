export default {
  "trade": "junk_removal",
  "label": "Junk removal",
  "kind": "A",
  "assist": true,
  "serviceField": "service",
  "fields": [
    {
      "key": "service",
      "label": "Truck space",
      "type": "select",
      "options": [
        {
          "value": "eighth",
          "label": "1/8 truck"
        },
        {
          "value": "quarter",
          "label": "1/4 truck"
        },
        {
          "value": "half",
          "label": "1/2 truck"
        },
        {
          "value": "three_quarters",
          "label": "3/4 truck"
        },
        {
          "value": "full",
          "label": "Full truck"
        }
      ],
      "default": "eighth",
      "drawing": "truck"
    },
    {
      "key": "heavy",
      "label": "Heavy material",
      "type": "select",
      "options": [
        {
          "value": "none",
          "label": "None"
        },
        {
          "value": "concrete",
          "label": "Concrete"
        },
        {
          "value": "dirt",
          "label": "Dirt"
        },
        {
          "value": "shingles",
          "label": "Shingles"
        }
      ],
      "default": "none"
    },
    {
      "key": "stairs",
      "label": "Stairs",
      "type": "select",
      "options": [
        {
          "value": "no",
          "label": "No"
        },
        {
          "value": "yes",
          "label": "Yes"
        }
      ],
      "default": "no"
    },
    {
      "key": "carry",
      "label": "Long carry",
      "type": "select",
      "options": [
        {
          "value": "no",
          "label": "No"
        },
        {
          "value": "yes",
          "label": "Yes"
        }
      ],
      "default": "no"
    },
    {
      "key": "mattresses",
      "label": "Mattresses",
      "type": "number",
      "min": 0,
      "max": 20,
      "default": 0,
      "unit": "items"
    },
    {
      "key": "tires",
      "label": "Tires",
      "type": "number",
      "min": 0,
      "max": 20,
      "default": 0,
      "unit": "items"
    },
    {
      "key": "freon",
      "label": "Appliances with freon",
      "type": "number",
      "min": 0,
      "max": 20,
      "default": 0,
      "unit": "items"
    }
  ],
  "rules": [
    {
      "field": "service",
      "op": "add",
      "prices": {
        "eighth": "service_eighth",
        "quarter": "service_quarter",
        "half": "service_half",
        "three_quarters": "service_three_quarters",
        "full": "service_full"
      }
    },
    {
      "field": "heavy",
      "op": "multiply",
      "prices": {
        "none": "heavy_none",
        "concrete": "heavy_concrete",
        "dirt": "heavy_dirt",
        "shingles": "heavy_shingles"
      }
    },
    {
      "field": "stairs",
      "op": "add",
      "prices": {
        "yes": "stairs_yes"
      }
    },
    {
      "field": "carry",
      "op": "add",
      "prices": {
        "yes": "carry_yes"
      }
    },
    {
      "field": "mattresses",
      "op": "unit",
      "price": "mattresses"
    },
    {
      "field": "tires",
      "op": "unit",
      "price": "tires"
    },
    {
      "field": "freon",
      "op": "unit",
      "price": "freon"
    }
  ],
  "prices": {
    "minimum": {
      "label": "Minimum charge",
      "default": 13000,
      "unit": "cents"
    },
    "range_low": {
      "label": "Range below estimate (%)",
      "default": 1000,
      "unit": "bps",
      "max": 9000
    },
    "range_high": {
      "label": "Range above estimate (%)",
      "default": 1500,
      "unit": "bps",
      "max": 10000
    },
    "service_eighth": {
      "label": "Truck space — 1/8 truck",
      "default": 13000,
      "unit": "cents"
    },
    "service_quarter": {
      "label": "Truck space — 1/4 truck",
      "default": 21250,
      "unit": "cents"
    },
    "service_half": {
      "label": "Truck space — 1/2 truck",
      "default": 37500,
      "unit": "cents"
    },
    "service_three_quarters": {
      "label": "Truck space — 3/4 truck",
      "default": 57500,
      "unit": "cents"
    },
    "service_full": {
      "label": "Truck space — Full truck",
      "default": 70000,
      "unit": "cents"
    },
    "heavy_none": {
      "label": "Heavy material — None",
      "default": 10000,
      "unit": "bps",
      "max": 30000
    },
    "heavy_concrete": {
      "label": "Heavy material — Concrete",
      "default": 15000,
      "unit": "bps",
      "max": 30000
    },
    "heavy_dirt": {
      "label": "Heavy material — Dirt",
      "default": 15000,
      "unit": "bps",
      "max": 30000
    },
    "heavy_shingles": {
      "label": "Heavy material — Shingles",
      "default": 14000,
      "unit": "bps",
      "max": 30000
    },
    "stairs_yes": {
      "label": "Stairs — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "carry_yes": {
      "label": "Long carry — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "mattresses": {
      "label": "Each mattress",
      "default": 3000,
      "unit": "cents"
    },
    "tires": {
      "label": "Each tire",
      "default": 1500,
      "unit": "cents"
    },
    "freon": {
      "label": "Each appliance with freon",
      "default": 7500,
      "unit": "cents"
    }
  },
  "notes": [
    "Price confirmed on site before we load.",
    "A full truck is about 15 cubic yards. Heavy material like concrete or dirt costs more."
  ]
};
