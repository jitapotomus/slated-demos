export default {
  "trade": "house_cleaning",
  "label": "House cleaning",
  "kind": "A",
  "assist": true,
  "serviceField": "service",
  "fields": [
    {
      "key": "service",
      "label": "Clean type",
      "type": "select",
      "options": [
        {
          "value": "regular",
          "label": "Regular"
        },
        {
          "value": "deep",
          "label": "Deep clean"
        },
        {
          "value": "move_out",
          "label": "Move-in / move-out"
        }
      ],
      "default": "regular"
    },
    {
      "key": "bedrooms",
      "label": "Bedrooms",
      "type": "number",
      "min": 0,
      "max": 12,
      "default": 3,
      "unit": "bedrooms"
    },
    {
      "key": "bathrooms",
      "label": "Bathrooms",
      "type": "number",
      "min": 1,
      "max": 12,
      "default": 2,
      "unit": "bathrooms"
    },
    {
      "key": "sqft",
      "label": "Approximate home size (optional; 0 if unknown)",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft"
    },
    {
      "key": "pets",
      "label": "Pets",
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
      "key": "oven",
      "label": "Inside oven",
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
      "key": "fridge",
      "label": "Inside fridge",
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
      "key": "windows",
      "label": "Inside windows",
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
      "key": "cabinets",
      "label": "Inside cabinets",
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
      "key": "laundry",
      "label": "Laundry (one load)",
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
      "key": "frequency",
      "label": "How often",
      "type": "select",
      "options": [
        {
          "value": "once",
          "label": "One time"
        },
        {
          "value": "monthly",
          "label": "Monthly"
        },
        {
          "value": "biweekly",
          "label": "Every 2 weeks"
        },
        {
          "value": "weekly",
          "label": "Weekly"
        }
      ],
      "default": "once"
    }
  ],
  "rules": [
    {
      "field": "bedrooms",
      "op": "unit",
      "price": "bedrooms",
      "included": 1
    },
    {
      "field": "bathrooms",
      "op": "unit",
      "price": "bathrooms",
      "included": 1
    },
    {
      "field": "sqft",
      "op": "unit",
      "price": "sqft",
      "included": 2000
    },
    {
      "field": "service",
      "op": "multiply",
      "prices": {
        "regular": "service_regular",
        "deep": "service_deep",
        "move_out": "service_move_out"
      }
    },
    {
      "field": "pets",
      "op": "add",
      "prices": {
        "yes": "pets_yes"
      }
    },
    {
      "field": "oven",
      "op": "add",
      "prices": {
        "yes": "oven_yes"
      }
    },
    {
      "field": "fridge",
      "op": "add",
      "prices": {
        "yes": "fridge_yes"
      }
    },
    {
      "field": "windows",
      "op": "add",
      "prices": {
        "yes": "windows_yes"
      }
    },
    {
      "field": "cabinets",
      "op": "add",
      "prices": {
        "yes": "cabinets_yes"
      }
    },
    {
      "field": "laundry",
      "op": "add",
      "prices": {
        "yes": "laundry_yes"
      }
    },
    {
      "field": "frequency",
      "op": "discount",
      "prices": {
        "once": "frequency_once",
        "monthly": "frequency_monthly",
        "biweekly": "frequency_biweekly",
        "weekly": "frequency_weekly"
      }
    }
  ],
  "prices": {
    "minimum": {
      "label": "Minimum charge",
      "default": 12000,
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
    "base": {
      "label": "Base visit (includes 1 bedroom and 1 bathroom)",
      "default": 12000,
      "unit": "cents"
    },
    "service_regular": {
      "label": "Clean type — Regular",
      "default": 10000,
      "unit": "bps",
      "max": 30000
    },
    "service_deep": {
      "label": "Clean type — Deep clean",
      "default": 14000,
      "unit": "bps",
      "max": 30000
    },
    "service_move_out": {
      "label": "Clean type — Move-in / move-out",
      "default": 18000,
      "unit": "bps",
      "max": 30000
    },
    "bedrooms": {
      "label": "Each extra bedroom",
      "default": 2000,
      "unit": "cents"
    },
    "bathrooms": {
      "label": "Each extra bathroom",
      "default": 3000,
      "unit": "cents"
    },
    "sqft": {
      "label": "Extra square foot above 2,000 sq ft (room prices still apply)",
      "default": 10,
      "unit": "cents"
    },
    "pets_yes": {
      "label": "Pets — Yes",
      "default": 2000,
      "unit": "cents"
    },
    "oven_yes": {
      "label": "Inside oven — Yes",
      "default": 2500,
      "unit": "cents"
    },
    "fridge_yes": {
      "label": "Inside fridge — Yes",
      "default": 2500,
      "unit": "cents"
    },
    "windows_yes": {
      "label": "Inside windows — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "cabinets_yes": {
      "label": "Inside cabinets — Yes",
      "default": 4000,
      "unit": "cents"
    },
    "laundry_yes": {
      "label": "Laundry (one load) — Yes",
      "default": 2000,
      "unit": "cents"
    },
    "frequency_once": {
      "label": "How often — One time",
      "default": 0,
      "unit": "bps",
      "max": 9000
    },
    "frequency_monthly": {
      "label": "How often — Monthly",
      "default": 500,
      "unit": "bps",
      "max": 9000
    },
    "frequency_biweekly": {
      "label": "How often — Every 2 weeks",
      "default": 1000,
      "unit": "bps",
      "max": 9000
    },
    "frequency_weekly": {
      "label": "How often — Weekly",
      "default": 1500,
      "unit": "bps",
      "max": 9000
    }
  },
  "notes": [
    "Homes over 2,000 sq ft cost a little more."
  ],
  "base": "base"
};
