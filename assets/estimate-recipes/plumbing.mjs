// Plumbing is a price menu (type C in QUOTE_RESEARCH.md): pick the job, get the owner's set price.
// Defaults are mid-range 2026 national figures; the owner replaces them on the Prices page.
export default {
  "trade": "plumbing",
  "label": "Plumbing",
  "kind": "A",
  "serviceField": "service",
  "fields": [
    {
      "key": "service",
      "label": "What do you need?",
      "type": "select",
      "options": [
        {"value": "drain", "label": "Clogged sink or tub drain"},
        {"value": "toilet_clog", "label": "Clogged toilet"},
        {"value": "main_line", "label": "Main sewer line backup"},
        {"value": "toilet_repair", "label": "Toilet repair (running, leaking, loose)"},
        {"value": "toilet_install", "label": "Install a new toilet"},
        {"value": "faucet", "label": "Replace a faucet"},
        {"value": "disposal", "label": "Replace a garbage disposal"},
        {"value": "heater_tank", "label": "Replace a tank water heater (40-50 gallon)"},
        {"value": "heater_tankless", "label": "Tankless water heater"},
        {"value": "other", "label": "Leak or something else"}
      ],
      "default": "drain"
    },
    {
      "key": "timing",
      "label": "When do you need it?",
      "type": "select",
      "options": [
        {"value": "regular", "label": "Weekday, regular hours"},
        {"value": "after", "label": "Evening or weekend"},
        {"value": "emergency", "label": "Emergency, right away"}
      ],
      "default": "regular"
    }
  ],
  "rules": [
    {
      "field": "service",
      "op": "add",
      "prices": {
        "drain": "service_drain",
        "toilet_clog": "service_toilet_clog",
        "main_line": "service_main_line",
        "toilet_repair": "service_toilet_repair",
        "toilet_install": "service_toilet_install",
        "faucet": "service_faucet",
        "disposal": "service_disposal",
        "heater_tank": "service_heater_tank",
        "heater_tankless": "service_heater_tankless",
        "other": "service_other"
      }
    },
    {
      "field": "timing",
      "op": "multiply",
      "prices": {
        "regular": "timing_regular",
        "after": "timing_after",
        "emergency": "timing_emergency"
      }
    }
  ],
  "prices": {
    "minimum": {"label": "Minimum charge", "default": 12500, "unit": "cents"},
    "range_low": {"label": "Range below estimate (%)", "default": 1000, "unit": "bps", "max": 9000},
    "range_high": {"label": "Range above estimate (%)", "default": 2000, "unit": "bps", "max": 10000},
    "service_drain": {"label": "Clogged sink or tub drain", "default": 17500, "unit": "cents"},
    "service_toilet_clog": {"label": "Clogged toilet", "default": 15000, "unit": "cents"},
    "service_main_line": {"label": "Main sewer line backup", "default": 35000, "unit": "cents"},
    "service_toilet_repair": {"label": "Toilet repair", "default": 17500, "unit": "cents"},
    "service_toilet_install": {"label": "Install a new toilet (labor, toilet extra)", "default": 40000, "unit": "cents"},
    "service_faucet": {"label": "Replace a faucet (labor, faucet extra)", "default": 25000, "unit": "cents"},
    "service_disposal": {"label": "Replace a garbage disposal (with a standard unit)", "default": 40000, "unit": "cents"},
    "service_heater_tank": {"label": "Tank water heater, installed with haul-away", "default": 185000, "unit": "cents"},
    "service_heater_tankless": {"label": "Tankless water heater, starting price", "default": 450000, "unit": "cents"},
    "service_other": {"label": "Service call to find the problem", "default": 12500, "unit": "cents"},
    "timing_regular": {"label": "Weekday, regular hours", "default": 10000, "unit": "bps", "max": 30000},
    "timing_after": {"label": "Evening or weekend", "default": 13500, "unit": "bps", "max": 30000},
    "timing_emergency": {"label": "Emergency, right away", "default": 16500, "unit": "bps", "max": 30000}
  },
  "notes": [
    "Leaks and unknown problems start with a service call. The plumber tells you the price before any work starts.",
    "New fixtures like a toilet or faucet are extra unless the line says included."
  ]
};
