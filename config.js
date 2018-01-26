var services = 
{
  "created": 1516811375602,
  "type": "service",
  "models": {
    "path": "/opt/soajs/node_modules/soajs.epg/lib/model/",
    "name": "soap"
  },
  "injection": true,
  "serviceGroup": "soapEp",
  "serviceName": "granta",
  "servicePort": 4100,
  "serviceVersion": 1,
  "requestTimeout": 50,
  "requestTimeoutRenewal": 5,
  "authentications": [
    {
      "name": "None",
      "category": "N/A"
    },
    {
      "name": "BasicEx",
      "category": "basicauth"
    },
    {
      "name": "OT1",
      "category": "oauth1"
    },
    {
      "name": "OT2",
      "category": "oauth2"
    },
    {
      "name": "CUST",
      "category": "custom"
    }
  ],
  "prerequisites": {},
  "swaggerInput": "",
  "schema": {
    "get": {},
    "post": {
      "/Browse/GetDatabasesRequest": {
        "_apiInfo": {
          "l": "List the databases available on the MI Server.",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {}
        }
      },
      "/Browse/GetTablesRequest": {
        "_apiInfo": {
          "l": "List the tables contained in a particular MI Database.",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object",
                "properties": {
                  "attributeSelectors": {
                    "required": false,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "TableFilter": {
                    "required": false,
                    "validation": {
                      "type": "string",
                      "enum": "enumerations.TableFilter"
                    }
                  },
                  "sequence": {
                    "type": "object",
                    "required": false,
                    "properties": {
                      "attributeSelector": {
                        "required": false,
                        "validation": {
                          "type": "string",
                          "enum": "enumerations.AttributeSelector"
                        }
                      }
                    }
                  },
                  "dbKey": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "_authorization": "OT1"
      },
      "/Browse/GetRootNodeRequest": {
        "_apiInfo": {
          "l": "Get information about the root node of a particular Table in an MI Database. This can be passed to the GetChildNodes() operation, to find the contents of the rest of the node-tree of the Table..",
          "group": "grantax"
        },
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object",
                "properties": {
                  "MIPseudoAttribute": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "ReferenceByName": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "IntegrationProfileReference": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "recordLinkGroupIdentity": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "CreateRecord": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "UpdateRecord": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "CopyRecord": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "ReportNamedPropertyValue": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "ExporterTransformIndex": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "ExporterTransformId": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "TraceProperty": {
                    "required": true,
                    "validation": {
                      "type": "string"
                    }
                  },
                  "PartialTableReference": {
                    "type": "object",
                    "required": false,
                    "properties": {
                      "tableIdentity": {
                        "required": false,
                        "validation": {
                          "type": "integer"
                        }
                      },
                      "tableGUID": {
                        "required": false,
                        "validation": {
                          "type": "string"
                        }
                      },
                      "tableName": {
                        "required": false,
                        "validation": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js"
      },
      "/Browse/GetChildNodesRequest": {
        "_apiInfo": {
          "l": "Get information about the child nodes of the given node in the node-tree of an MI Table, optionally recursing into all their children (do not do this for very large tables)..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object",
                "properties": {
                  "recurse": {
                    "required": false,
                    "validation": {
                      "type": "boolean"
                    }
                  },
                  "recurseMaxDepth": {
                    "required": false,
                    "validation": {
                      "type": "integer"
                    }
                  },
                  "populateGUIDs": {
                    "required": false,
                    "validation": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/Browse/GetLayoutsRequest": {
        "_apiInfo": {
          "l": "List the Layouts for an MI Database or for one Table in a Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetSubsetsRequest": {
        "_apiInfo": {
          "l": "List the Subsets for an MI Database or for one Table in a Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetRecordVersionsRequest": {
        "_apiInfo": {
          "l": "Get information about the available version(s) of given Record(s). This would generally be applied to Version-Controlled Tables, although it is legal to call for any Table..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetRecordAttributesRequest": {
        "_apiInfo": {
          "l": "Returns information about which Attributes have Data, for given Record(s). Includes information about when Data was created and retired, in a Version-Controlled Table. Does NOT retrieve values of the Data; for that, use the DataExport or EngineeringData services..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetMetaAttributesRequest": {
        "_apiInfo": {
          "l": "Returns the Meta-Attributes of one or more parent Attributes in a Table of an MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetAttributeDetailsRequest": {
        "_apiInfo": {
          "l": "Returns detailed meta-information about given Attribute(s) in an MI Database. Does NOT retrieve values of the Data; for that, use the DataExport or EngineeringData services..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetAttributeParametersRequest": {
        "_apiInfo": {
          "l": "Gets detailed information about the Parameters that are declared to be usable with given Attribute(s) in an MI Database. Generally makes sense only when applied to Functional Attributes or Multi-Valued Attributes..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetAttributeMinMaxRequest": {
        "_apiInfo": {
          "l": "Returns the maximum and minimum values of Data for given Attribute(s) in an MI Database. The values reflect only those Records and Data to which the caller has access. Optionally, the Records involved can be further filtered..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetParameterDetailsRequest": {
        "_apiInfo": {
          "l": "Gets detailed information about the given Parameter(s) in an MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/ReadHelpFileRequest": {
        "_apiInfo": {
          "l": "Reads and returns the contents of the Help File for the given entity in an MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetUnitSystemsRequest": {
        "_apiInfo": {
          "l": "Gets information about the unit systems known to a Database and the currencies known to an installation of Granta MI (they do not vary between Databases).",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetDatasheetPathParameterizedRequest": {
        "_apiInfo": {
          "l": "Gets information that may be used to construct an HTTP URL to a Granta MI datasheet, served by MI:Viewer..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetDatasheetPathRequest": {
        "_apiInfo": {
          "l": "For each record reference gets the relative portion of an HTTP URL to a Granta MI datasheet, served by MI:Viewer..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetRecordLinkGroupsRequest": {
        "_apiInfo": {
          "l": "Gets details of Record Link Groups in a Granta MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetLinkedRecordsRequest": {
        "_apiInfo": {
          "l": "Gets the linked records for specified or all source records, for one or more record link groups..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetTreeRecordsRequest": {
        "_apiInfo": {
          "l": "Gets name, record type and some tree information for the given record(s). Does not fetch the tree children; use GetChildRecords operation to do that..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/LocateRecordInTreeRequest": {
        "_apiInfo": {
          "l": "Returns ancestor and sibling information for a given Record, up to and including the root of the tree in which the Record resides. This operation aims to return all the information needed to render a tree 'open' at the given Record, without returning the huge amount of data that is often returned when a whole tree is requested; however, in a large table, this operation could still return a large amount of data..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetDatabaseParametersRequest": {
        "_apiInfo": {
          "l": "Returns details of all Parameters in a Granta MI Database. Where details of the parameter can be overridden by a particular Attribute or for a particular piece of Data, this operation returns the non-overridden default details. Use GetParameterDetails(), passing an Attribute and Record, to get the Attribute-specific or Data-specific overridden details..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetIntegrationProfilesRequest": {
        "_apiInfo": {
          "l": "Returns details of all Integration Profiles in a Granta MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetAssociatedRecordsRequest": {
        "_apiInfo": {
          "l": "Returns all the Records, in a single target Table, that are associated with each of a given set of source Records, via Tabular Data links. These links can be in the forward or reverse direction. Note that, if there is more than one Tabular Attribute linking the source and target Tables, the Associated Records are the union of all those linked by each of the Tabular Attributes..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetCurrenciesRequest": {
        "_apiInfo": {
          "l": "Returns details of all currencies defined on the server..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/ResolveReferencesRequest": {
        "_apiInfo": {
          "l": "For each references to an MI entity in the request, checks whether or not the current user is able to see a corresponding MI entity (ie. that the entity referred to exists, and the user has read permission to it). Additionally determines whether or not the current user has write access to the MI entity. Note that even if the entity references all refer to the same MI entity they are still all returned individually in the response..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetUnitsRequest": {
        "_apiInfo": {
          "l": "Gets all the units for the given database(s)..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Browse/GetUnitConversionsRequest": {
        "_apiInfo": {
          "l": "Gets all available unit conversions, for the given source unit(s) and/or unit system(s)..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/EngineeringData/GetAvailableExportersRequest": {
        "_apiInfo": {
          "l": "Returns the FEA Exporter configurations known to the MI Server, optionally filtering for their applicability to particular situations..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/EngineeringData/ExportersForRecordsRequest": {
        "_apiInfo": {
          "l": "Returns the FEA Exporter configurations, known to the MI:Server, filtering for their applicability to given Record(s) and optionally to particular situations..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/EngineeringData/ExportRecordDataRequest": {
        "_apiInfo": {
          "l": "Performs an FEA Export and returns the result as the response..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/EngineeringData/GetExporterParametersRequest": {
        "_apiInfo": {
          "l": "Returns information about the MI Parameter Values that will need to be chosen, to run the specified Exporter on the specified Record(s)..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/EngineeringData/TransformExportRequest": {
        "_apiInfo": {
          "l": "Runs some or all of the Transforms of the specified Exporter on the caller-supplied data..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataExport/GetRecordAttributesByRefRequest": {
        "_apiInfo": {
          "l": "Fetches the Data values for the given Attribute(s) and Record(s) in an MI Database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataExport/GetDataWritabilityRequest": {
        "_apiInfo": {
          "l": "-=-=-=",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataImport/SetRecordAttributesRequest": {
        "_apiInfo": {
          "l": "Sets the Data values for the given Attribute(s) and Record(s) in an MI Database. Note: this operation can accept an arbitrary number of Attributes and Records to be imported, but in practice there is a fairly low limit to the amount of data that can be imported in a single operation. Client code should perform large imports in small chunks..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataImport/ModifyRecordLinksRequest": {
        "_apiInfo": {
          "l": "Adds or removes static Links between Record(s) in an MI Database. Note: this operation can accept an arbitrary number of Records to be linked, but in practice there is a limit to the amount of records that can be linked in a single operation. Client code should perform very large imports in chunks..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataImport/EnsureRecordFolderPathsRequest": {
        "_apiInfo": {
          "l": "Checks whether given hierarchies of folders exist, creating them if not. Each hierarchy is specified as a sequence of tree names; where the folder needs to be created, this name is also used as the full name of the created folder. New folders will be assigned to their parents' subsets; existing folders are not assigned or removed from any subsets. If a colour is specified, new folders will be of that colour; existing folders' colours are never changed. Note: this operation can accept an arbitrary number of Record Folder paths to be ensured, but in practice there is a limit to the amount of changes that can be done in a single operation..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/DataImport/GetUploadAddressesRequest": {
        "_apiInfo": {
          "l": "Returns an address to which a Datum can be uploaded, for each combination of given sets of Records and Attributes in an MI Database. Each address will be an HTTP or HTTPS URL. The upload service only supports a subset of all available MI Attribute types, but this operation will give an address for an Attribute of any type..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/ReportFormatter/FormatReportRequest": {
        "_apiInfo": {
          "l": "Runs a report, which is returned as the response.",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/ReportFormatter/ListReportsRequest": {
        "_apiInfo": {
          "l": "Lists the available reports, optionally filtering for their applicability to particular inputs. Normally, one or more of the possible ways of filtering the returned reports should be used. If no filtering is used, all reports will be returned; this may be a large number of reports, many of which are likely to be incompatible with the client's requirements..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/ReportFormatter/GetReportDetailsRequest": {
        "_apiInfo": {
          "l": "Gets detailed information about report(s). Does not run any report..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Search/SimpleTextSearchRequest": {
        "_apiInfo": {
          "l": "Searches for records matching simple text criteria.",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Search/CriteriaSearchRequest": {
        "_apiInfo": {
          "l": "Searches for records matching Attribute-based criteria..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Search/GetStandardNamedCriteriaRequest": {
        "_apiInfo": {
          "l": "Returns information about all the Standard-Named attributes that are searchable within a given Granta MI database..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Search/RecordNameSearchRequest": {
        "_apiInfo": {
          "l": "Searches for Records with a given exact Record name..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      },
      "/Trace/TraceRequest": {
        "_apiInfo": {
          "l": "Traces errors and/or activities, specified in the request, to a server-side destination..",
          "group": "grantax"
        },
        "mw": "/opt/soajs/node_modules/soajs.epg/lib/mw/soap/index.js",
        "imfv": {
          "commonFields": [],
          "custom": {
            "record": {
              "required": true,
              "source": [
                "body.record"
              ],
              "validation": {
                "type": "object"
              }
            }
          }
        }
      }
    },
    "put": {},
    "delete": {}
  },
  "errors": {
    "400": "invalid input",
    "401": "invalid id",
    "402": "store is empty"
  }
};
module.exports = services;