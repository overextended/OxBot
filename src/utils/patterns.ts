export const positivePatterns = [
  /\bh[ae]lp\b/i, // help, hlep, halp
  /\bsuppor?t\b/i, // support, suport
  /\b(can|could|would)\s+(someone|anyone|you)\s+(please\s+)?(help|assist|explain)\b/i,
  /\b(how|where|why|what)\s+.*?\b(can|do|is|to|fix|get|access|convert)\b/i,
  /\b(error|issue|problem|trouble)\b.*?\b(with|connecting|occurred|message|code|connection)\b/i,
  /\b(i\s+(am|have)\s+(a\s+)?(problem|question|issue|error))\b/i,
  /\b(unable|cannot|can't|won't|not able to)\s+.*?\b(connect|access|post|use|work)\b/i,
  /\b(urgent|asap|immediat?e?ly|critical|important)\b/i,
];


export const resourcePatterns = [
  /ox[ _]?inventory/i, // Matches "ox inventory", "oxinventory", "ox_inventory"
  /ox[ _]?lib/i, // Matches "ox lib", "oxlib", "ox_lib"
  /ox[ _]?core/i, // Matches "ox core", "oxcore", "ox_core"
  /ox[ _]?doorlock/i, // Matches "ox doorlock", "oxdoorlock", "ox_doorlock"
  /ox[ _]?target/i, // Matches "ox target", "oxtarget", "ox_target"
  /ox[ _]?fuel/i, // Matches "ox fuel", "oxfuel", "ox_fuel"
  /oxmysql/i, // Matches "oxmysql"
];
