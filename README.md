# Soajs.epg

The SOAJS EPG is an endpoint service generator that loads the endpoint configuration created via the API builder of **Herron Tech** and uses it to launch the service on top of the [SOAJS Composer](https://github.com/soajs/soajs.composer)

## API Builder
The API builder is an advanced system by [Herron Tech](www.herrontech.com) that enables creating and managing endpoint services via a simple UI wizard.

## SOAJS Composer
The SOAJS Composer is an engine component that generates **REST API Services** on top of the **SOAJS** framework ([Read More](https://github.com/soajs/soajs.composer)).

## Environment Variables
The service generator requires the following envionrment variables
| Variable Name | Description |
| ------ | ------ |
| SOAJS_SRVIP | specify the IP address to bind the service to |
| SOAJS_ENV | specify the environment that the service will be deployed in |
| SOAJS_REGISTRY_API | specify the controller location to load the environment's registry |
| SOAJS_ENDPOINT_NAME | specify which endpoint system to load from the database and launch |
Reference: [SOAJS Environment Variables](https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61975478/Environment+Variables)

## Installation & Launch
```sh
$ npm install soajs.epg
$ cd soajs.epg
$ export SOAJS_REGISTRY_API=http://localhost:5000
$ export SOAJS_ENDPOINT_NAME=my_endpoint_name
$ node.
```