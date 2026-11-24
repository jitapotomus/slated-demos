export default {
  "trade": "auto_detailing",
  "label": "Auto detailing",
  "kind": "A",
  "serviceField": "service",
  "fields": [
    {
      "key": "service",
      "label": "Package",
      "type": "select",
      "options": [
        {
          "value": "exterior",
          "label": "Exterior"
        },
        {
          "value": "interior",
          "label": "Interior"
        },
        {
          "value": "full",
          "label": "Full detail"
        },
        {
          "value": "correction",
          "label": "Paint correction"
        },
        {
          "value": "ceramic",
          "label": "Ceramic coating"
        }
      ],
      "default": "full"
    },
    {
      "key": "vehicle",
      "label": "Vehicle size",
      "type": "select",
      "options": [
        {
          "value": "car",
          "label": "Car"
        },
        {
          "value": "suv",
          "label": "SUV"
        },
        {
          "value": "truck",
          "label": "Truck"
        },
        {
          "value": "van",
          "label": "Van"
        }
      ],
      "default": "car"
    },
    {
      "key": "condition",
      "label": "Condition",
      "type": "select",
      "options": [
        {
          "value": "normal",
          "label": "Normal"
        },
        {
          "value": "dirty",
          "label": "Dirty"
        },
        {
          "value": "very_dirty",
          "label": "Very dirty"
        }
      ],
      "default": "normal"
    },
    {
      "key": "pet_hair",
      "label": "Pet hair",
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
      "key": "engine",
      "label": "Engine bay",
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
      "key": "headlights",
      "label": "Headlight restoration",
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
      "key": "odor",
      "label": "Odor treatment",
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
    }
  ],
  "rules": [
    {
      "field": "service",
      "op": "add",
      "prices": {
        "exterior": "service_exterior",
        "interior": "service_interior",
        "full": "service_full",
        "correction": "service_correction",
        "ceramic": "service_ceramic"
      }
    },
    {
      "field": "vehicle",
      "op": "multiply",
      "prices": {
        "car": "vehicle_car",
        "suv": "vehicle_suv",
        "truck": "vehicle_truck",
        "van": "vehicle_van"
      }
    },
    {
      "field": "condition",
      "op": "multiply",
      "prices": {
        "normal": "condition_normal",
        "dirty": "condition_dirty",
        "very_dirty": "condition_very_dirty"
      }
    },
    {
      "field": "pet_hair",
      "op": "add",
      "prices": {
        "yes": "pet_hair_yes"
      }
    },
    {
      "field": "engine",
      "op": "add",
      "prices": {
        "yes": "engine_yes"
      }
    },
    {
      "field": "headlights",
      "op": "add",
      "prices": {
        "yes": "headlights_yes"
      }
    },
    {
      "field": "odor",
      "op": "add",
      "prices": {
        "yes": "odor_yes"
      }
    }
  ],
  "prices": {
    "minimum": {
      "label": "Minimum charge",
      "default": 0,
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
    "service_exterior": {
      "label": "Package — Exterior",
      "default": 10000,
      "unit": "cents"
    },
    "service_interior": {
      "label": "Package — Interior",
      "default": 12500,
      "unit": "cents"
    },
    "service_full": {
      "label": "Package — Full detail",
      "default": 20000,
      "unit": "cents"
    },
    "service_correction": {
      "label": "Package — Paint correction",
      "default": 60000,
      "unit": "cents"
    },
    "service_ceramic": {
      "label": "Package — Ceramic coating",
      "default": 160000,
      "unit": "cents"
    },
    "vehicle_car": {
      "label": "Vehicle size — Car",
      "default": 10000,
      "unit": "bps",
      "max": 30000
    },
    "vehicle_suv": {
      "label": "Vehicle size — SUV",
      "default": 13750,
      "unit": "bps",
      "max": 30000
    },
    "vehicle_truck": {
      "label": "Vehicle size — Truck",
      "default": 17500,
      "unit": "bps",
      "max": 30000
    },
    "vehicle_van": {
      "label": "Vehicle size — Van",
      "default": 18750,
      "unit": "bps",
      "max": 30000
    },
    "condition_normal": {
      "label": "Condition — Normal",
      "default": 10000,
      "unit": "bps",
      "max": 30000
    },
    "condition_dirty": {
      "label": "Condition — Dirty",
      "default": 12500,
      "unit": "bps",
      "max": 30000
    },
    "condition_very_dirty": {
      "label": "Condition — Very dirty",
      "default": 15000,
      "unit": "bps",
      "max": 30000
    },
    "pet_hair_yes": {
      "label": "Pet hair — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "engine_yes": {
      "label": "Engine bay — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "headlights_yes": {
      "label": "Headlight restoration — Yes",
      "default": 7500,
      "unit": "cents"
    },
    "odor_yes": {
      "label": "Odor treatment — Yes",
      "default": 7500,
      "unit": "cents"
    }
  },
  "notes": [
    "Very dirty interiors or heavy pet hair can add to the price."
  ]
};
