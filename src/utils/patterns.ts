export const positivePatterns = [
  /(\bhelp\b|\bhlep\b|\bhalp\b)/i, // help, hlep, halp
  /(\bsupport\b|\bsuport\b)/i, // support, suport
  /(\bhow\s+can\b)/i, // how can
  /(\bcan\b.*\bhelp\b)/i, // can help
  /(\bneed\b.*\bhelp\b)/i, // need help
  /(\bhow\s+do\s+I\b)/i, // how do I
  /(\bproblem\b.*\bwith\b)/i, // problem with
  /(\bissue\b.*\bwith\b)/i, // issue with
  /(\btrouble\b.*\bwith\b)/i, // trouble with
  /(\bcan\s+someone\b)/i, // can someone
  /(\banyone\b.*\bhelp\b)/i, // anyone help
  /(\bassist\b|\bassistance\b)/i, // assist, assistance
  /(\bASAP\b|\burgent\b|\bimmediately\b)/i, // ASAP, urgent, immediately
  /(\bstruggling\b.*\bwith\b)/i, // struggling with
  /(\bcould\b.*\bplease\b)/i, // could please
  /(\bwould\s+appreciate\b)/i, // would appreciate
  /(\bgrateful\s+for\b)/i, // grateful for
  /(\berror\b|\bissue\b|\bproblem\b)/i, // error, issue, problem
  /(\bcan\s+anyone\b|\bis\s+there\s+anyone\b|\blooking\s+for\s+someone\b)/i, // can anyone, is there anyone, looking for someone
  /(\bhelp\s+me\b)/i, // help me
  /(\bneed\b.*\bassistance\b)/i, // need assistance
  /(\bhow\s+to\b)/i, // how to
  /(\bguide\b|\bguidance\b)/i, // guide, guidance
  /(\bcan\b.*\bexplain\b)/i, // can explain
  /(\bwhat\s+is\s+the\s+way\s+to\b)/i, // what is the way to
  /(\bplease\b.*\bhelp\b)/i, // please help
  /(\banybody\b.*\bhelp\b)/i, // anybody help
  /(\bsomeone\b.*\bassist\b)/i, // someone assist
  /(\bwho\s+can\b)/i, // who can
  /(\bany\s+advice\b|\bany\s+tips\b)/i, // any advice, any tips
  /(\bhow\s+do\s+i\s+get\s+access\s+to\b.*\bsupport\b)/i, // how do i get access to support
  /(\bwhy\s+can'?t\s+i\s+type\s+in\b.*\bsupport\b)/i, // why can't i type in support, why cant i type in support
  /(\bcannot\s+type\s+in\b.*\bsupport\b)/i, // cannot type in support
  /(\bcan'?t\s+type\s+in\b.*\bsupport\b)/i, // can't type in support, cant type in support
  /(\baccess\s+to\s+type\s+in\b.*\bsupport\b)/i, // access to type in support
  /(\bcannot\s+access\b.*\bsupport\b)/i, // cannot access support
  /(\bcan'?t\s+access\b.*\bsupport\b)/i, // can't access support, cant access support
  /(\bget\s+access\s+to\b.*\bsupport\b)/i, // get access to support
  /(\btype\s+in\b.*\bsupport\b)/i, // type in support
  /(\bparticipate\s+in\b.*\bsupport\b)/i, // participate in support
  /(\baccess\s+the\s+support\s+forum\b)/i, // access the support forum
  /(\baccess\s+the\s+support\s+channel\b)/i, // access the support channel
  /(\bwhy\s+can'?t\s+i\s+access\b.*\bsupport\b)/i, // why can't i access support, why cant i access support
  /(\bi\s+am\s+getting\s+an\s+error\b)/i, // i am getting an error
  /(\bcan'?t\s+connect\b)/i, // can't connect, cant connect
  /(\bcannot\s+connect\b)/i, // cannot connect
  /(\bunable\s+to\s+connect\b)/i, // unable to connect
  /(\berror\s+message\b)/i, // error message
  /(\bissue\s+connecting\b)/i, // issue connecting
  /(\bproblem\s+with\s+connection\b)/i, // problem with connection
  /(\bconnection\s+error\b)/i, // connection error
  /(\bconnection\s+issue\b)/i, // connection issue
  /(\btrouble\s+connecting\b)/i, // trouble connecting
  /(\berror\s+code\b)/i, // error code
  /(\berror\s+occurred\b)/i, // error occurred
  /(\bexperiencing\s+an\s+error\b)/i, // experiencing an error
  /(\bfacing\s+an\s+error\b)/i, // facing an error
  /(\bconnectivity\s+issues\b)/i, // connectivity issues
  /(\bconnection\s+problems\b)/i, // connection problems
  /(\berror\s+while\s+connecting\b)/i, // error while connecting
  /(\bcan'?t\s+establish\s+connection\b)/i, // can't establish connection, cant establish connection
  /(\bcannot\s+establish\s+connection\b)/i, // cannot establish connection
  /(\berror\s+trying\s+to\s+connect\b)/i, // error trying to connect
  /(\bi\s+can'?t\s+get\s+script\s+to\s+work\b)/i, // i can't get script to work, i cant get script to work
  /(\bscript\s+does\s+not\s+work\b)/i, // script does not work
  /(\bscript\s+not\s+working\s+properly\b)/i, // script not working properly
  /(\bscript\s+is\s+giving\s+me\s+errors\b)/i, // script is giving me errors
  /(\bi\s+am\s+requesting\s+your\s+aid\b)/i, // i am requesting your aid
  /(\btell\s+me\s+how\s+to\b)/i, // tell me how to
  /(\bsomeone\s+can\s+tell\s+me\s+how\b)/i, // someone can tell me how
  /(\bsql\s+is\s+not\s+connecting\b)/i, // sql is not connecting
  /(\bi\s+have\s+a\s+question\b)/i, // i have a question
  /(\bhow\s+do\s+we\s+program\b)/i, // how do we program
  /(\bis\s+there\s+a\s+way\b)/i, // is there a way
  /(\bi\s+want\s+to\s+convert\b)/i, // i want to convert
  /(\bsomeone\s+give\s+me\s+the\s+code\b)/i, // someone give me the code
  /(\bconvert\s+it\s+for\s+me\b)/i, // convert it for me
  /(\bwhy\s+is\s+it\s+broken\b)/i, // why is it broken
  /(\bno\s+work\b)/i, // no work
  /(\bdoesn'?t\s+work\b)/i, // doesn't work, doesnt work
  /(\bdoes\s+anyone\s+know\b)/i, // does anyone know
];

export const negativePatterns = [
  /(\bdon'?t\s+need\s+help\b|\bno\s+help\s+needed\b)/i, // don't need help, dont need help, no help needed
  /(\bwas\s+helping\b)/i, // was helping
  /(\bnot\s+looking\s+for\s+help\b)/i, // not looking for help
  /(\bno\s+help\s+required\b)/i, // no help required
  /(\bcan\s+help\b.*\bwithout\b)/i, // can help without
  /(\bhave\s+solved\b|\bhave\s+resolved\b)/i, // have solved, have resolved
  /(\bfigured\s+it\s+out\b)/i, // figured it out
  /(\bdon'?t\s+need\s+assistance\b)/i, // don't need assistance, dont need assistance
  /(\bno\s+assistance\s+required\b)/i, // no assistance required
  /(\bthanks.*\bfor\s+the\s+help\b)/i, // thanks for the help
  /(\bjust\s+helped\b)/i, // just helped
  /(\balready\s+received\s+help\b)/i, // already received help
  /(\bhelping\s+myself\b)/i, // helping myself
  /(\bI\s+can\s+manage\b)/i, // I can manage
  /(\bno\s+further\s+help\s+needed\b)/i, // no further help needed
  /(\bhelp\s+is\s+not\s+required\b)/i, // help is not required
  /(\bproblem\s+solved\b)/i, // problem solved
  /(\bissue\s+resolved\b)/i, // issue resolved
  /(\bI've\s+got\s+this\b)/i, // I've got this
  /(\bno\s+more\s+help\s+needed\b)/i, // no more help needed
  /(\bhandle\s+it\s+myself\b)/i, // handle it myself
  /(\bno\s+need\s+for\s+help\b)/i, // no need for help
  /(\bI\s+don'?t\s+require\s+help\b)/i, // I don't require help, I dont require help
  /(\bself\s+sufficient\b)/i, // self sufficient
  /(\bno\s+trouble\s+here\b)/i, // no trouble here
  /(\bmanaged\s+on\s+my\s+own\b)/i, // managed on my own
];

export const resourcePatterns = [
  /ox[ _]?inventory/i,    // Matches "ox inventory", "oxinventory", "ox_inventory"
  /ox[ _]?lib/i,          // Matches "ox lib", "oxlib", "ox_lib"
  /ox[ _]?core/i,         // Matches "ox core", "oxcore", "ox_core"
  /ox[ _]?doorlock/i,     // Matches "ox doorlock", "oxdoorlock", "ox_doorlock"
  /ox[ _]?target/i,       // Matches "ox target", "oxtarget", "ox_target"
  /ox[ _]?fuel/i,         // Matches "ox fuel", "oxfuel", "ox_fuel"
  /oxmysql/i              // Matches "oxmysql"
];
