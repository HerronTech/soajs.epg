/**
 * In this example we are doing the following:
 * Trigger: /authorization
 *          /token
 *          /account/getUser
 */

let mapper = {
    pipeline: {
        "myAuthtrigger": {
            trigger: {
                label: "call1",
                timeout: 3600000,
                uri: "http://127.0.0.1:4000/oauth",
                route: "/authorization",
                method: "GET",
                json: true,
                augment: [
                    {
                        headers: {
                            what: "key",
                            value: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9"
                        }
                    }
                ],
                remove: [
                    {
                        from: "headers",
                        paths: [
                            "host",
                            "soajsinjectobj"
                        ]
                    }
                ],
                "map": {
                    "authorization": {"path": "data"}
                }
            }
        },
        "myTokentrigger": {
            trigger: {
                label: "call2",
                timeout: 3600000,
                uri: "http://127.0.0.1:4000/oauth",
                route: "/token",
                method: "POST",
                json: true,
                augment: [
                    {
                        headers: {
                            what: "key",
                            value: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9"
                        }
                    },
                    {
                        headers: {
                            what: "Authorization",
                            "from": "map",
                            "path": "authorization"
                        }
                    },
                    {
                        body: {
                            what: "username",
                            value: "owner"
                        }
                    },
                    {
                        body: {
                            what: "password",
                            value: "password"
                        }
                    },
                    {
                        body: {
                            what: "grant_type",
                            value: "password"
                        }
                    }
                ],
                remove: [
                    {
                        from: "headers",
                        paths: [
                            "host",
                            "soajsinjectobj"
                        ]
                    }
                ],
                "map": {
                    "access_token": {"path": "access_token"},
                    "refresh_token": {"path": "refresh_token"}
                }
            }
        },
        "myUsertrigger": {
            trigger: {
                label: "call3",
                timeout: 3600000,
                uri: "http://127.0.0.1:4000/urac",
                route: "/account/getUser",
                method: "GET",
                json: true,
                augment: [
                    {
                        headers: {
                            what: "key",
                            value: "3d90163cf9d6b3076ad26aa5ed58556348069258e5c6c941ee0f18448b570ad1c5c790e2d2a1989680c55f4904e2005ff5f8e71606e4aa641e67882f4210ebbc5460ff305dcb36e6ec2a2299cf0448ef60b9e38f41950ec251c1cf41f05f3ce9"
                        }
                    },
                    {
                        qs: {
                            what: "access_token",
                            "from": "map",
                            "path": "access_token"
                        }
                    },
                    {
                        qs: {
                            what: "username",
                            "value": "owner"
                        }
                    }
                ],
                "map": {
                    "anything": {"match": /\w*(?=Name)/}
                }
            }
        },
        "myAuthresponse": {
            response: {
                build: {
                    'augment': [
                        {"headers": {"what": 'Content-Type', 'value': 'application/json'}}
                    ],
                    answer: {from: "map", path: "call3"}
                }
            }
        }
    },
    apis: {
        "/authorize": [
            "myAuthtrigger",
            "myTokentrigger",
            "myUsertrigger",
            "myAuthresponse"
        ]
    }
};