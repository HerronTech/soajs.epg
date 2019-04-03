/**
 * In this example we are doing the following:
 * Trigger: to call the uri that is coming from serviceConfig
 *          label call1
 *          timeout 3600000
 *          augment:
 *              get the headers from the request
 *              add to the header content-type text/xml
 *              get the method from the request
 *              get the query from the request as qs
 *          remove:
 *              from headers the following [key, host, soajsinjectobj]
 * Response: passthrough response
 *          proxy the answer from call1
 */

let mapper = {
    pipeline: {
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
                    }
                ],
                remove: [
                    {
                        from: "headers",
                        paths: [
                            "key",
                            "host",
                            "soajsinjectobj"
                        ]
                    }
                ]
            }
        },
        "myresponse": {
            response: {
                passthrough: {
                    from: "call1"
                },
            }
        }
    },
    apis: {
        "/CheckPhoneNumber": [
            "mytrigger",
            "myresponse"
        ]
    }
};