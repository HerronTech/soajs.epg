let provision = {
    SERVICENAME: {

        // url OR host
        url: "http://ws.cdyne.com/phoneverify/phoneverify.asmx",

        //to be deleted [host & request]
        host: {
            protocol: "http",
            domain: "ws.cdyne.com",
            port: "80"
        },
        request: {
            headers: {
                'Content-Type': 'application/json'
            },
            json: true //true || false
        }
    }
};

let registry = {
    custom: {
        SERVICENAME: {
            value: {
                //SAME as above
            }
        }
    }
};

let mapper = [
    {
        'request': {
            'map': {
                'tony': {"from": "headers", "path": "key"},
                'hage': "headers"
            }
        }
    },

    {
        'let': {
            'map': {
                'paul': "eeeee",
                'mathieu': 12
            }
        }
    },
    {
        'trigger': {
            "label": "authorize",
            "timeout": 3600000,
            "uri": "http://dashboard-api.soajs.org/oauth",
            "uri": {"from": "serviceConfig", "path": "url"},
            "route": "/authorization",
            "json": true,

            "augment": [
                {"headers": {"what": "key", "value": "12121213133"}},
                {"headers": {"what": "ikey", "from": "map", "path": "tony"}}
            ],
            "map": {
                "access_token": {"path": "access_token"},
                "anything": {"match": /[0-9]+(.[0-9]+)?/}
            }
        }
    },
    {
        '$parallel': [
            {
                'trigger': {
                    "label": "call1",
                    "timeout": 3600000,
                    'uri': "",
                    "route": "",

                    'augment': [
                        {"qs": {"what": "access_token", "from": "map", "path": "access_token"}}
                    ],
                    "remove": [
                        {
                            "from": "headers",
                            "paths": ["key", "host", "soajsinjectobj"]
                        }
                    ],
                    "map": {
                        "tony": {"path": "email"}
                    }
                }
            },
            {
                'trigger': {
                    "label": "call2",
                    "route": "",
                    'uri': "",
                    'augment': [],
                    "remove": [],
                    "map": {}
                }
            }
        ]
    },
    {
        'trigger': {
            "label": "call3",
            "route": "",
            'uri': "",
            'augment': [],
            "remove": [],
            "map": {}
        }
    },
    {
        'response': {
            "build": {
                "status": 200,
                'answer': {'from': 'map', 'path': 'call1'},
                'answer': {'value': {}},
                'augment': [
                    {"headers": {"what": 'Content-Type', 'value': 'application/json'}}
                ]
            },
            "passthrough": {
                "from": "call2"
            }
        }
    }
];
