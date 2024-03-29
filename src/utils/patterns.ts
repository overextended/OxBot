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
  /(\bhow\s+do\s+i\b)/i, // how do i
  /(\bhow\s+to\s+fix\b)/i, // How to fix
  /(\bneed\s+advice\s+on\b)/i, // Need advice on
  /(\bwhat\s+should\s+I\s+do\s+about\b)/i, // What should I do about
  /(\bdon't\s+understand\s+how\s+to\b)/i, // Don't understand how to
  /(\bconfused\s+about\b)/i, // Confused about
  /(\blooking\s+for\s+information\s+on\b)/i, // Looking for information on
  /(\bseeking\s+help\s+with\b)/i, // Seeking help with
  /(\bdoes\s+anyone\s+have\b)/i, // does anyone have
  /(\bcan\s+u\s+send\b)/i, // can u send
  /(\bcan\s+you\s+send\b)/i, // can you send
  /(\bis\s+it\s+possible\b)/i, // is it possible
  /(\bI\s+was\s+wondering\b)/i, // I was wondering
  /(\bwhere\s+can\b)/i, // where can
  /(\btried\s+to\s+post\b)/i, // tried to post
  /(\bi\s+have\s+(a\s+)?question\b)/i, // i have question, i have a question
  /(\bconvert\s+from\b)/i, // convert from
  /(\bqb\s+inventory\b)/i, // qb inventory
  /(\bhello\s+guys\b)/i, // Hello guys
  /(\bqbcore\s+server\b)/i, // qbcore server
  /(\bconverted\s+to\b)/i, // converted to
  /(\bhow\s+to\s+convert\b)/i, // how to convert
  /(\bhelp\s+me\s+convert\b)/i, // help me convert
  /(\banyone\s+has\b)/i, // anyone has
  /(\bpossible\s+to\s+convert\b)/i, // possible to convert
  /(\bhow\s+can\s+we\s+get\b)/i, // how can we get
  /(\bi\s+want\s+to\s+make\s+a\s+script\b)/i, // i want to make a script
  /(\bwhere\s+can\s+i\s+find\b)/i, // where can i find
  /(\bhelp\s+with\s+script\b)/i, // help with script
  /(\box\s+script\b)/i, // ox script
  /(\bto\s+fix\s+this\b)/i, // to fix this
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
