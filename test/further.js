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
    { allowable_as_side_effect :
      { text      : '[]{}'
      , events    :
        [ ['openarray'  , undefined]
        , ['closearray' , undefined]
        , ['openobject' , undefined]
        , ['closeobject', undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_0 :
      { text      : '["x","y","z"]'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["value"      , "y"]
        , ["value"      , "z"]
        , ['closearray' , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_1 :
      { text      : '["x","y","'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["value"      , "y"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_2 :
      { text      : '["x","y",'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["value"      , "y"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_3 :
      { text      : '["x","y"'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["value"      , "y"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_4 :
      { text      : '["x","y'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_5 :
      { text      : '["x",'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , xxh :
      { text      : '["x"'
      , events    :
        [ ['openarray'  , undefined]
        , ["value"      , "x"]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_6 :
      { text      : '["x'
      , events    :
        [ ['openarray'  , undefined]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_7 :
      { text      : '["'
      , events    :
        [ ['openarray'  , undefined]
        , ["error"      , undefined]
        , ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_array_8 :
      { text      : ''
      , events    :
        [ ['end'        , undefined]
        , ['ready'      , undefined]
        ]
      }
    , broken_object_1   :
      { text   : '{"a":{"b":"c"}'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["value"       , "c"]
        , ["closeobject" , undefined]
        , ["error"       , undefined]
        ]
      }
    , broken_object_2   :
      { text   : '{"a":{"b":"c"'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["value"       , "c"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_3   :
      { text   : '{"a":{"b":"c'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_4   :
      { text   : '{"a":{"b":"'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_5   :
      { text   : '{"a":{"b":'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_6   :
      { text   : '{"a":{"b"'
      , events :
        [ ["openobject"  , "a"]
        , ["openobject"  , "b"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_7   :
      { text   : '{"a":{"b'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_8   :
      { text   : '{"a":{"'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_9   :
      { text   : '{"a":{'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_10  :
      { text   : '{"a":'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_11  :
      { text   : '{"a"'
      , events :
        [ ["openobject"  , "a"]
        , ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_12  :
      { text   : '{"a'
      , events :
        [ ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_13  :
      { text   : '{"'
      , events :
        [ ["error"       , undefined]
        , ['end'         , undefined]
        , ['ready'       , undefined]
        ]
      }
    , broken_object_14  :
      { text   : '{'
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

describe('clarinet', function(){
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
