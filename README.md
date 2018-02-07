# Soajs.epg

Soajs EPG is an endpoint generator service.
To start the service, define the following environment variables:
- SOAJS_REGISTRY_API: used to get registry and database info
- SOAJS_ENV: used to define your environment
- SOAJS_ENDPOINT_NAME: used to load your specific endpoint

Your config data will be retrieved from your endpoint collection, and it will be used in memory to start the service using the [composer](https://github.com/soajs/soajs.composer)

