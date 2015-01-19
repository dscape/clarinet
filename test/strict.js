if (!clarinet) { // node 
  var clarinet  = require('../clarinet.js')
    , _         = require('underscore')
    ;
}

function assert(expr, msg) {
  if (!expr) {
    throw new Error(msg || 'failed');
  }
}

var docs =
    { brokenArray1 :
      { text      : '["x","y'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , brokenArray2 :
      { text      : '["x'
      , events    :
        [ ['openarray'  , undefined]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , brokenArray3 :
      { text      : ''
      , events    :
        [ ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , brokenObject4   :
      { text   : '{"a":{"b":"c'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , brokenObject5   :
      { text   : '{"a":{"b"'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , brokenObject6   :
      { text   : '{"a":{"b'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , brokenObject7  :
      { text   : '{"a"'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , brokenObject8  :
      { text   : '{"a'
      , events :
        [ ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    };

var seps   = [undefined, /\t|\n|\r/, '']
  , sep
  ;

function generic(key, prechunked, sep) {
  return function () {
    var doc        = docs[key].text
      , events     = docs[key].events
      , l          = typeof FastList === 'function' ? new FastList() : []
      , doc_chunks = !prechunked ? doc.split(sep) : docs[key].chunks
      , parser     = clarinet.parser()
      , i          = 0
      , current
      , env = process && process.env ? process.env : window
      , record     = []
      ;


      // explicitly set 'strict' mode for the parser
      parser.opt.strict = true;


    _.each(events, function(event_pair) { 
      l.push(event_pair); 
    });
    _.each(clarinet.EVENTS, function(event) {
      parser["on"+event] = function (value) {
        if(env.CRECORD) { // for really big json we dont want to type all
          record.push([event,value]);
          if(event === 'end') console.log(JSON.stringify(record, null, 2));
        } else {
          current = l.shift();
          ++i;
          if(!(current && current[0])) { return; }
          assert(current[0] === event, 
            '[ln' + i + '] event: [' + current[0] + '] got: [' + event +']');
          if(event!== 'error')
            assert(current[1] === value, 
              '[ln' + i + '] value: [' + current[1] + '] got: [' + value +']');
        }
      };
    });
    _.each(doc_chunks, function(chunk) { 
     parser.write(chunk);
    });
    parser.end();
  };
}

describe('strict', function(){
  // Attention:test cases here are for strict-mode only
  if(clarinet.parser()["strictfeature"]===undefined) {
    // The running 'clarinet.js' does NOT support strict-feature
    // bypass this test case
    return;
  }
  describe('#generic', function() {
    for (var key in docs) {
      if (docs.hasOwnProperty(key)) {
        // undefined means no split
        // /\t|\n|\r| / means on whitespace
        // '' means on every char
        for(var i in seps) {
          sep = seps[i];
          it('[' + key + '] should be able to parse -> ' + sep,
            generic(key, false, sep));
        }
      }
    }
  });

  describe('#pre-chunked', function() {
    for (var key in docs) {
      if (docs.hasOwnProperty(key)) {
        if (!docs[key].chunks) continue;

        it('[' + key + '] should be able to parse pre-chunked', generic(key, true));
      }
    }
  });
});
