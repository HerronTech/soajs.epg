/**
 * In this example we are doing the following:
 * Let: to set 2 variable (tony, and hage)
 * Trigger: to call the uri that is coming from serviceConfig
 *          label call1
 *          timeout 3600000
 *          augment:
 *              get the headers from the request
 *              add to the header content-type text/xml
 *              get the method from the request
 *              get the query from the request as qs
 *              add haha = 69 tp qs
 *              add hage to qs from map
 *          remove:
 *              from headers the following [key, host, soajsinjectobj, tony.hage]
 * Response: build a new response
 *          augment:
 *              headers with content-type text/xml
 *              answer:
 *                  get from map the answer from call1
 */

let mapper = {
    pipeline: {
        "mylet": {
            let: {
                map: {
                    tony: "eeeee",
                    hage: 12
                }
            }
        },
        "mytrigger": {
            trigger: {
                label: "call1",
                timeout: 3600000,
                uri: {
                    from: "serviceConfig",
                    path: "url"
                },
                route: "/CheckPhoneNumber",
                augment: [
                    {
                        headers: {
                            from: "request",
                            path: "headers"
                        }
                    },
                    {
                        headers: {
                            what: "Content-Type",
                            value: "text/xml"
                        }
                    },
                    {
                        method: {
                            from: "request",
                            path: "method"
                        }
                    },
                    {
                        qs: {
                            from: "request",
                            path: "query"
                        }
                    },
                    {
                        qs: {
                            what: "haba",
                            value: "69"
                        }
                    },
                    {
                        qs: {
                            what: "hage",
                            from: "map",
                            path: "hage"
                        }
                    }
                ],
                remove: [
                    {
                        from: "headers",
                        paths: [
                            "key",
                            "host",
                            "soajsinjectobj",
                            "tony.hage"
                        ]
                    }
                ]
            }
        },
        "myresponse": {
            response: {
                build: {
                    augment: [
                        {
                            headers: {
                                what: "Content-Type",
                                value: "text/xml"
                            }
                        }
                    ],
                    answer: {
                        from: "map",
                        path: "call1"
                    }
                }
            }
        }
    },
    apis: {
        "/CheckPhoneNumber": [
            "mylet",
            "mytrigger",
            "myresponse"
        ]
    }
};