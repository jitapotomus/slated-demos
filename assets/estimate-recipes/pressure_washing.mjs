export default {
  "trade": "pressure_washing",
  "label": "Pressure washing",
  "kind": "A",
  "serviceField": "service",
  "fields": [
    {
      "key": "service",
      "label": "Service",
      "type": "select",
      "options": [
        {
          "value": "washing",
          "label": "Surface cleaning"
        }
      ],
      "default": "washing"
    },
    {
      "key": "driveway",
      "label": "Driveway",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 600,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (300 sq ft)",
          "value": 300
        },
        {
          "label": "Medium (600 sq ft)",
          "value": 600
        },
        {
          "label": "Large (1000 sq ft)",
          "value": 1000
        }
      ]
    },
    {
      "key": "sidewalk",
      "label": "Sidewalk",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (100 sq ft)",
          "value": 100
        },
        {
          "label": "Medium (250 sq ft)",
          "value": 250
        },
        {
          "label": "Large (500 sq ft)",
          "value": 500
        }
      ]
    },
    {
      "key": "patio",
      "label": "Patio",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (150 sq ft)",
          "value": 150
        },
        {
          "label": "Medium (350 sq ft)",
          "value": 350
        },
        {
          "label": "Large (600 sq ft)",
          "value": 600
        }
      ]
    },
    {
      "key": "siding",
      "label": "House siding",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (1000 sq ft)",
          "value": 1000
        },
        {
          "label": "Medium (1800 sq ft)",
          "value": 1800
        },
        {
          "label": "Large (2500 sq ft)",
          "value": 2500
        }
      ]
    },
    {
      "key": "deck",
      "label": "Deck",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (150 sq ft)",
          "value": 150
        },
        {
          "label": "Medium (300 sq ft)",
          "value": 300
        },
        {
          "label": "Large (500 sq ft)",
          "value": 500
        }
      ]
    },
    {
      "key": "fence",
      "label": "Fence",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (200 sq ft)",
          "value": 200
        },
        {
          "label": "Medium (500 sq ft)",
          "value": 500
        },
        {
          "label": "Large (1000 sq ft)",
          "value": 1000
        }
      ]
    },
    {
      "key": "roof",
      "label": "Roof soft wash",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft",
      "presets": [
        {
          "label": "Skip",
          "value": 0
        },
        {
          "label": "Small (1000 sq ft)",
          "value": 1000
        },
        {
          "label": "Medium (1800 sq ft)",
          "value": 1800
        },
        {
          "label": "Large (2500 sq ft)",
          "value": 2500
        }
      ]
    },
    {
      "key": "stories",
      "label": "House stories",
      "type": "select",
      "options": [
        {
          "value": "one",
          "label": "1 story"
        },
        {
          "value": "two",
          "label": "2 stories"
        },
        {
          "value": "three",
          "label": "3 stories"
        }
      ],
      "default": "one"
    },
    {
      "key": "oil",
      "label": "Oil stain treatment",
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
      "key": "sealing",
      "label": "Area to seal (0 for none)",
      "type": "number",
      "min": 0,
      "max": 20000,
      "default": 0,
      "unit": "sq ft"
    }
  ],
  "rules": [
    {
      "field": "service",
      "op": "add",
      "prices": {}
    },
    {
      "field": "driveway",
      "op": "unit",
      "price": "driveway",
      "tiers": [
        {
          "upTo": 1000,
          "price": "driveway"
        },
        {
          "upTo": 20000,
          "price": "driveway_large"
        }
      ]
    },
    {
      "field": "sidewalk",
      "op": "unit",
      "price": "sidewalk",
      "tiers": [
        {
          "upTo": 1000,
          "price": "sidewalk"
        },
        {
          "upTo": 20000,
          "price": "sidewalk_large"
        }
      ]
    },
    {
      "field": "patio",
      "op": "unit",
      "price": "patio",
      "tiers": [
        {
          "upTo": 1000,
          "price": "patio"
        },
        {
          "upTo": 20000,
          "price": "patio_large"
        }
      ]
    },
    {
      "field": "siding",
      "op": "unit",
      "price": "siding",
      "tiers": [
        {
          "upTo": 1000,
          "price": "siding"
        },
        {
          "upTo": 20000,
          "price": "siding_large"
        }
      ]
    },
    {
      "field": "deck",
      "op": "unit",
      "price": "deck",
      "tiers": [
        {
          "upTo": 1000,
          "price": "deck"
        },
        {
          "upTo": 20000,
          "price": "deck_large"
        }
      ]
    },
    {
      "field": "fence",
      "op": "unit",
      "price": "fence",
      "tiers": [
        {
          "upTo": 1000,
          "price": "fence"
        },
        {
          "upTo": 20000,
          "price": "fence_large"
        }
      ]
    },
    {
      "field": "roof",
      "op": "unit",
      "price": "roof",
      "tiers": [
        {
          "upTo": 1000,
          "price": "roof"
        },
        {
          "upTo": 20000,
          "price": "roof_large"
        }
      ]
    },
    {
      "field": "stories",
      "op": "multiply",
      "prices": {
        "one": "stories_one",
        "two": "stories_two",
        "three": "stories_three"
      },
      "scope": [
        "siding"
      ]
    },
    {
      "field": "oil",
      "op": "add",
      "prices": {
        "yes": "oil_yes"
      }
    },
    {
      "field": "sealing",
      "op": "unit",
      "price": "sealing"
    }
  ],
  "prices": {
    "minimum": {
      "label": "Minimum charge",
      "default": 15000,
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
    "driveway": {
      "label": "Driveway (per sq ft)",
      "default": 38,
      "unit": "cents"
    },
    "driveway_large": {
      "label": "Driveway (per sq ft above 1,000)",
      "default": 32,
      "unit": "cents"
    },
    "sidewalk": {
      "label": "Sidewalk (per sq ft)",
      "default": 38,
      "unit": "cents"
    },
    "sidewalk_large": {
      "label": "Sidewalk (per sq ft above 1,000)",
      "default": 32,
      "unit": "cents"
    },
    "patio": {
      "label": "Patio (per sq ft)",
      "default": 38,
      "unit": "cents"
    },
    "patio_large": {
      "label": "Patio (per sq ft above 1,000)",
      "default": 32,
      "unit": "cents"
    },
    "siding": {
      "label": "House siding (per sq ft)",
      "default": 30,
      "unit": "cents"
    },
    "siding_large": {
      "label": "House siding (per sq ft above 1,000)",
      "default": 26,
      "unit": "cents"
    },
    "deck": {
      "label": "Deck (per sq ft)",
      "default": 43,
      "unit": "cents"
    },
    "deck_large": {
      "label": "Deck (per sq ft above 1,000)",
      "default": 37,
      "unit": "cents"
    },
    "fence": {
      "label": "Fence (per sq ft)",
      "default": 38,
      "unit": "cents"
    },
    "fence_large": {
      "label": "Fence (per sq ft above 1,000)",
      "default": 32,
      "unit": "cents"
    },
    "roof": {
      "label": "Roof soft wash (per sq ft)",
      "default": 75,
      "unit": "cents"
    },
    "roof_large": {
      "label": "Roof soft wash (per sq ft above 1,000)",
      "default": 64,
      "unit": "cents"
    },
    "stories_one": {
      "label": "House stories — 1 story",
      "default": 10000,
      "unit": "bps",
      "max": 30000
    },
    "stories_two": {
      "label": "House stories — 2 stories",
      "default": 12000,
      "unit": "bps",
      "max": 30000
    },
    "stories_three": {
      "label": "House stories — 3 stories",
      "default": 14000,
      "unit": "bps",
      "max": 30000
    },
    "oil_yes": {
      "label": "Oil stain treatment — Yes",
      "default": 5000,
      "unit": "cents"
    },
    "sealing": {
      "label": "Sealing (per sq ft)",
      "default": 100,
      "unit": "cents"
    }
  },
  "notes": [
    "Sizes are approximate, so the final price may move a little."
  ],
  "requireAny": [
    "driveway",
    "sidewalk",
    "patio",
    "siding",
    "deck",
    "fence",
    "roof"
  ]
};
