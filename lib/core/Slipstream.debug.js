;
(function () {
	Slipstream.debug = {
		/*
		 ### `Slipstream.debug.enabled`
		 > Type: Boolean, Default: `true`

		 #### Description
		 > This parameter allows you to flag a setting globally throughout the Slipstream as to whether or not any debugging console messages should be displayed. In a production setting this should likely be set to `false` to hide all messages.
		 > It would also be possible, if you build int some kind of admin level access inside the user accounts, for a production environment to globally set this false simple to any none admin users to non-admin users when configured on the server side. Rough pseudo code `Slipstream.debug.enabled = function() { return !!Meteor.user().isAdmin; }` - a simple function that would return a boolean; using a `!!` helps ensure whatever result we're evaluating is returned to us as boolean no matter what, a very handy little optimization trick.
		 */
		enabled        : true,
		/*
		 ### `Slipstream.debug.log(message, args)`
		 > Type: Function, Returns: void

		 #### Description
		 > This function is used to route all debugging messages throughout the Slipstream, and passes it along to the `Meteor._debug(message)` function.  The reason behind this verses simply calling that function itself is simple, to provide the global flag for whether or not any console messages should appear at all, such as for production use.

		 #### Parameters
		 > `message` - String
		 > The debugging message that will be relayed to the console output for you.
		 >
		 > `args` - String (Optional)
		 > A collection of arguments that can be passed in to allow objects to be displayed
		 */
		log            : function (message, args) {
			if (Meteor.isClient && Slipstream.debug.enabled)
				Meteor._debug(message, args || '');
		},
		error          : function (message, args) {
			if (Meteor.isClient && Slipstream.debug.enabled && console)
				console.error(message, args || '');
		},
		assert         : function (check, message) {
			if (console)
				console.assert(check, message || '');
		},
		groupCollapsed : function (desc) {
			if (Meteor.isClient && console)
				console.groupCollapsed(desc);
		},
		groupEnd       : function () {
			if (Meteor.isClient && console)
				console.groupEnd();
		},
		throwError     : function (code, message, objects) {
			/*
			 For the sake of not having to replicate all of the default error code messages, the follow list of json error
			 codes was leveraged from. Only the summaries are utilized, though I've left in the definitions for the sake of
			 trying to learn and remember more of the codes and their meanings as I work
			 https://github.com/citricsquid/httpstatus.es/tree/master/codes
			 By Samuel Ryan (citricsquid) 2012 - 2013 (C)
			 */
			var checkCode = function checkCode(code) {
				var result = {
						code    : code,
						title   : 'Unknown Error Code',
						summary : message
					},
					errorCodes = {
						"100" : {
							"code"         : "100",
							"title"        : "Continue",
							"summary"      : "Client should continue with request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This means that the server has received the request headers, and that the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). If the request body is large, sending it to a server when a request has already been rejected based upon inappropriate headers is inefficient. To have a server check if the request could be accepted based on the request's headers alone, a client must send Expect: 100-continue as a header in its initial request and check if a 100 Continue status code is received in response before continuing (or receive 417 Expectation Failed and not continue).",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#100"
								},
								"ietf"      : {
									"body" : "The client SHOULD continue with its request. This interim response is used to inform the client that the initial part of the request has been received and has not yet been rejected by the server. The client SHOULD continue by sending the remainder of the request or, if the request has already been completed, ignore this response. The server MUST send a final response after the request has been completed.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":continue"
								}
							}
						},
						"101" : {
							"code"         : "101",
							"title"        : "Switching Protocols",
							"summary"      : "Server is switching protocols",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This means the requester has asked the server to switch protocols and the server is acknowledging that it will do so.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#101"
								},
								"ietf"      : {
									"body" : "The server understands and is willing to comply with the client's request, via the Upgrade message header field, for a change in the application protocol being used on this connection. The server will switch protocols to those defined by the response's Upgrade header field immediately after the empty line which terminates the 101 response. \r\nThe protocol SHOULD be switched only when it is advantageous to do so. For example, switching to a newer version of HTTP is advantageous over older versions, and switching to a real-time, synchronous protocol might be advantageous when delivering resources that use such features.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":switching_protocols"
								}
							}
						},
						"102" : {
							"code"         : "102",
							"title"        : "Processing (WebDAV) (RFC 2518)",
							"summary"      : "Server has received and is processing the request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "As a WebDAV request may contain many sub-requests involving file operations, it may take a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet. This prevents the client from timing out and assuming the request was lost.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#102"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":processing"
								}
							}
						},
						"103" : {
							"code"         : "103",
							"title"        : "Checkpoint",
							"summary"      : "resume aborted PUT or POST requests",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This code is used in the Resumable HTTP Requests Proposal to resume aborted PUT or POST requests.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#103"
								}
							}
						},
						"122" : {
							"code"         : "122",
							"title"        : "Request-URI too long",
							"summary"      : "URI is longer than a maximum of 2083 characters",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This is a non-standard IE7-only code which means the URI is longer than a maximum of 2083 characters.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#122"
								}
							}
						},
						"200" : {
							"code"         : "200",
							"title"        : "OK",
							"summary"      : "standard response for successful HTTP requests",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request the response will contain an entity describing or containing the result of the action.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#200"
								},
								"ietf"      : {
									"body" : "The request has succeeded. The information returned with the response is dependent on the method used in the request, for example: GET an entity corresponding to the requested resource is sent in the response; HEAD the entity-header fields corresponding to the requested resource are sent in the response without any message-body; POST an entity describing or containing the result of the action;",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":ok"
								}
							}
						},
						"201" : {
							"code"         : "201",
							"title"        : "Created",
							"summary"      : "request has been fulfilled;  new resource created",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request has been fulfilled and resulted in a new resource being created.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#201"
								},
								"ietf"      : {
									"body" : "The request has been fulfilled and resulted in a new resource being created. The newly created resource can be referenced by the URI(s) returned in the entity of the response, with the most specific URI for the resource given by a Location header field. The response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media type given in the Content-Type header field. The origin server MUST create the resource before returning the 201 status code. If the action cannot be carried out immediately, the server SHOULD respond with 202 (Accepted) response instead.\r\n A 201 response MAY contain an ETag response header field indicating the current value of the entity tag for the requested variant just created.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":created"
								}
							}
						},
						"202" : {
							"code"         : "202",
							"title"        : "Accepted",
							"summary"      : "request accepted, processing pending",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.[2]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#202"
								},
								"ietf"      : {
									"body" : "The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place. There is no facility for re-sending a status code from an asynchronous operation such as this. \r\nThe 202 response is intentionally non-committal. Its purpose is to allow a server to accept a request for some other process (perhaps a batch-oriented process that is only run once per day) without requiring that the user agent's connection to the server persist until the process is completed. The entity returned with this response SHOULD include an indication of the request's current status and either a pointer to a status monitor or some estimate of when the user can expect the request to be fulfilled.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":accepted"
								}
							}
						},
						"203" : {
							"code"         : "203",
							"title"        : "Non-Authoritative Information (since HTTP\/1.1)",
							"summary"      : "request processed, information may be from another source",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server successfully processed the request, but is returning information that may be from another source.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#203"
								},
								"ietf"      : {
									"body" : "The returned metainformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy. The set presented MAY be a subset or superset of the original version. For example, including local annotation information about the resource might result in a superset of the metainformation known by the origin server. Use of this response code is not required and is only appropriate when the response would otherwise be 200 (OK).",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":non_authoritative_information"
								}
							}
						},
						"204" : {
							"code"         : "204",
							"title"        : "No Content",
							"summary"      : "request processed, no content returned",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server successfully processed the request, but is not returning any content.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#204"
								},
								"ietf"      : {
									"body" : "The server has fulfilled the request but does not need to return an entity-body, and might want to return updated metainformation. The response MAY include new or updated metainformation in the form of entity-headers, which if present SHOULD be associated with the requested variant.\r\nIf the client is a user agent, it SHOULD NOT change its document view from that which caused the request to be sent. This response is primarily intended to allow input for actions to take place without causing a change to the user agent's active document view, although any new or updated metainformation SHOULD be applied to the document currently in the user agent's active view.\r\nThe 204 response MUST NOT include a message-body, and thus is always terminated by the first empty line after the header fields.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":no_content"
								}
							}
						},
						"205" : {
							"code"         : "205",
							"title"        : "Reset Content",
							"summary"      : "request processed, no content returned, reset document view",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#205"
								},
								"ietf"      : {
									"body" : "The server has fulfilled the request and the user agent SHOULD reset the document view which caused the request to be sent. This response is primarily intended to allow input for actions to take place via user input, followed by a clearing of the form in which the input is given so that the user can easily initiate another input action. The response MUST NOT include an entity.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":reset_content"
								}
							}
						},
						"206" : {
							"code"         : "206",
							"title"        : "Partial Content",
							"summary"      : "partial resource return due to request header",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server is delivering only part of the resource due to a range header sent by the client. The range header is used by tools like wget to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#206"
								},
								"ietf"      : {
									"body" : "The server has fulfilled the partial GET request for the resource. The request MUST have included a Range header field indicating the desired range, and MAY have included an If-Range header field to make the request conditional.\r\nThe response MUST include the following header fields:\r\nEither a Content-Range header field (section 14.16) indicating the range included with this response, or a multipart\/byteranges Content-Type including Content-Range fields for each part. If a Content-Length header field is present in the response, its value MUST match the actual number of OCTETs transmitted in the message-body.\r\nDate\r\nETag and\/or Content-Location, if the header would have been sent in a 200 response to the same request\r\nExpires, Cache-Control, and\/or Vary, if the field-value might differ from that sent in any previous response for the same variant\r\nIf the 206 response is the result of an If-Range request that used a strong cache validator, the response SHOULD NOT include other entity-headers. If the response is the result of an If-Range request that used a weak validator, the response MUST NOT include other entity-headers; this prevents inconsistencies between cached entity-bodies and updated headers. Otherwise, the response MUST include all of the entity-headers that would have been returned with a 200 (OK) response to the same request.\r\nA cache MUST NOT combine a 206 response with other previously cached content if the ETag or Last-Modified headers do not match exactly.\r\nA cache that does not support the Range and Content-Range headers MUST NOT cache 206 (Partial) responses.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":partial_content"
								}
							}
						},
						"207" : {
							"code"         : "207",
							"title"        : "Multi-Status (WebDAV) (RFC 4918)",
							"summary"      : "XMLl, can contain multiple separate responses",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#207"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":multi_status"
								}
							}
						},
						"208" : {
							"code"         : "208",
							"title"        : "Already Reported (WebDAV) (RFC 5842)",
							"summary"      : "results previously returned ",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#208"
								}
							}
						},
						"226" : {
							"code"         : "226",
							"title"        : "IM Used (RFC 3229)",
							"summary"      : "request fulfilled, reponse is instance-manipulations",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#226"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":im_used"
								}
							}
						},
						"300" : {
							"code"         : "300",
							"title"        : "Multiple Choices",
							"summary"      : "multiple options for the resource delivered",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Indicates multiple options for the resource that the client may follow. It, for instance, could be used to present different format options for video, list files with different extensions, or word sense disambiguation.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#300"
								},
								"ietf"      : {
									"body" : "The requested resource corresponds to any one of a set of representations, each with its own specific location, and agent- driven negotiation information is being provided so that the user (or user agent) can select a preferred representation and redirect its request to that location.\r\nUnless it was a HEAD request, the response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media type given in the Content- Type header field. Depending upon the format and the capabilities of the user agent, selection of the most appropriate choice MAY be performed automatically. However, this specification does not define any standard for such automatic selection.\r\nIf the server has a preferred choice of representation, it SHOULD include the specific URI for that representation in the Location field; user agents MAY use the Location field value for automatic redirection. This response is cacheable unless indicated otherwise.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":multiple_choices"
								}
							}
						},
						"301" : {
							"code"         : "301",
							"title"        : "Moved Permanently",
							"summary"      : "this and all future requests directed to the given URI",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This and all future requests should be directed to the given URI.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#301"
								},
								"ietf"      : {
									"body" : "The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. Clients with link editing capabilities ought to automatically re-link references to the Request-URI to one or more of the new references returned by the server, where possible. This response is cacheable unless indicated otherwise.\r\nThe new permanent URI SHOULD be given by the Location field in the response. Unless the request method was HEAD, the entity of the response SHOULD contain a short hypertext note with a hyperlink to the new URI(s).\r\nIf the 301 status code is received in response to a request other than GET or HEAD, the user agent MUST NOT automatically redirect the request unless it can be confirmed by the user, since this might change the conditions under which the request was issued.\r\nNote: When automatically redirecting a POST request after receiving a 301 status code, some existing HTTP\/1.0 user agents will erroneously change it into a GET request.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":moved_permanently"
								}
							}
						},
						"302" : {
							"code"         : "302",
							"title"        : "Found",
							"summary"      : "temporary response to request found via alternative URI",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This is an example of industrial practice contradicting the standard. HTTP\/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was \"Moved Temporarily\"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP\/1.1 added status codes 303 and 307 to distinguish between the two behaviours. However, some Web applications and frameworks use the 302 status code as if it were the 303.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#302"
								},
								"ietf"      : {
									"body" : "The requested resource resides temporarily under a different URI. Since the redirection might be altered on occasion, the client SHOULD continue to use the Request-URI for future requests. This response is only cacheable if indicated by a Cache-Control or Expires header field.\r\nThe temporary URI SHOULD be given by the Location field in the response. Unless the request method was HEAD, the entity of the response SHOULD contain a short hypertext note with a hyperlink to the new URI(s).\r\nIf the 302 status code is received in response to a request other than GET or HEAD, the user agent MUST NOT automatically redirect the request unless it can be confirmed by the user, since this might change the conditions under which the request was issued.\r\nNote: RFC 1945 and RFC 2068 specify that the client is not allowed to change the method on the redirected request. However, most existing user agent implementations treat 302 as if it were a 303 response, performing a GET on the Location field-value regardless of the original request method. The status codes 303 and 307 have been added for servers that wish to make unambiguously clear which kind of reaction is expected of the client.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":found"
								}
							}
						},
						"303" : {
							"code"         : "303",
							"title"        : "See Other",
							"summary"      : "permanent response to request found via alternative URI",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT\/DELETE), it should be assumed that the server has received the data and the redirect should be issued with a separate GET message.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#303"
								},
								"ietf"      : {
									"body" : "The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource. This method exists primarily to allow the output of a POST-activated script to redirect the user agent to a selected resource. The new URI is not a substitute reference for the originally requested resource. The 303 response MUST NOT be cached, but the response to the second (redirected) request might be cacheable.\r\nThe different URI SHOULD be given by the Location field in the response. Unless the request method was HEAD, the entity of the response SHOULD contain a short hypertext note with a hyperlink to the new URI(s).\r\nNote: Many pre-HTTP\/1.1 user agents do not understand the 303 status. When interoperability with such clients is a concern, the 302 status code may be used instead, since most user agents react to a 302 response as described here for 303.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":see_other"
								}
							}
						},
						"304" : {
							"code"         : "304",
							"title"        : "Not Modified",
							"summary"      : "resource has not been modified since last requested",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Indicates the resource has not been modified since last requested. Typically, the HTTP client provides a header like the If-Modified-Since header to provide a time against which to compare. Using this saves bandwidth and reprocessing on both the server and client, as only the header data must be sent and received in comparison to the entirety of the page being re-processed by the server, then sent again using more bandwidth of the server and client.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#304"
								},
								"ietf"      : {
									"body" : "If the client has performed a conditional GET request and access is allowed, but the document has not been modified, the server SHOULD respond with this status code. The 304 response MUST NOT contain a message-body, and thus is always terminated by the first empty line after the header fields.\r\nThe response MUST include the following header fields:\r\nDate, unless its omission is required\r\nIf a clockless origin server obeys these rules, and proxies and clients add their own Date to any response received without one (as already specified by RFC 2068), caches will operate correctly.\r\nETag and\/or Content-Location, if the header would have been sent in a 200 response to the same request\r\nExpires, Cache-Control, and\/or Vary, if the field-value might differ from that sent in any previous response for the same variant\r\nIf the conditional GET used a strong cache validator, the response SHOULD NOT include other entity-headers. Otherwise (i.e., the conditional GET used a weak validator), the response MUST NOT include other entity-headers; this prevents inconsistencies between cached entity-bodies and updated headers.\r\nIf a 304 response indicates an entity not currently cached, then the cache MUST disregard the response and repeat the request without the conditional.\r\nIf a cache uses a received 304 response to update a cache entry, the cache MUST update the entry to reflect any new field values given in the response.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":not_modified"
								}
							}
						},
						"305" : {
							"code"         : "305",
							"title"        : "Use Proxy (since HTTP\/1.1)",
							"summary"      : "content located elsewhere, retrieve from there",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Many HTTP clients (such as Mozilla and Internet Explorer) do not correctly handle responses with this status code, primarily for security reasons.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#305"
								},
								"ietf"      : {
									"body" : "The requested resource MUST be accessed through the proxy given by the Location field. The Location field gives the URI of the proxy. The recipient is expected to repeat this single request via the proxy. 305 responses MUST only be generated by origin servers.\r\nNote: RFC 2068 was not clear that 305 was intended to redirect a single request, and to be generated by origin servers only. Not observing these limitations has significant security consequences.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":use_proxy"
								}
							}
						},
						"306" : {
							"code"         : "306",
							"title"        : "Switch Proxy",
							"summary"      : "subsequent requests should use the specified proxy",
							"descriptions" : {
								"wikipedia" : {
									"body" : "No longer used. Originally meant \"Subsequent requests should use the specified proxy.\"",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#306"
								},
								"ietf"      : {
									"body" : "The 306 status code was used in a previous version of the specification, is no longer used, and the code is reserved.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							}
						},
						"307" : {
							"code"         : "307",
							"title"        : "Temporary Redirect (since HTTP\/1.1)",
							"summary"      : "connect again to different uri as provided",
							"descriptions" : {
								"wikipedia" : {
									"body" : "In this occasion, the request should be repeated with another URI, but future requests can still use the original URI. In contrast to 303, the request method should not be changed when reissuing the original request. For instance, a POST request must be repeated using another POST request.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#307"
								},
								"ietf"      : {
									"body" : "The requested resource resides temporarily under a different URI. Since the redirection MAY be altered on occasion, the client SHOULD continue to use the Request-URI for future requests. This response is only cacheable if indicated by a Cache-Control or Expires header field.\r\nThe temporary URI SHOULD be given by the Location field in the response. Unless the request method was HEAD, the entity of the response SHOULD contain a short hypertext note with a hyperlink to the new URI(s) , since many pre-HTTP\/1.1 user agents do not understand the 307 status. Therefore, the note SHOULD contain the information necessary for a user to repeat the original request on the new URI.\r\nIf the 307 status code is received in response to a request other than GET or HEAD, the user agent MUST NOT automatically redirect the request unless it can be confirmed by the user, since this might change the conditions under which the request was issued.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":temporary_redirect"
								}
							}
						},
						"308" : {
							"code"         : "308",
							"title"        : "Resume Incomplete",
							"summary"      : "resumable HTTP Requests",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This code is used in the Resumable HTTP Requests Proposal to resume aborted PUT or POST requests.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#308"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":no_content"
								}
							}
						},
						"400" : {
							"code"         : "400",
							"title"        : "Bad Request",
							"summary"      : "request cannot be fulfilled due to bad syntax",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request cannot be fulfilled due to bad syntax.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#400"
								},
								"ietf"      : {
									"body" : "The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":bad_request"
								}
							}
						},
						"401" : {
							"code"         : "401",
							"title"        : "Unauthorized",
							"summary"      : "authentication is possible but has failed ",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Similar to 403 Forbidden, but specifically for use when authentication is possible but has failed or not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#401"
								},
								"ietf"      : {
									"body" : "The request requires user authentication. The response MUST include a WWW-Authenticate header field containing a challenge applicable to the requested resource. The client MAY repeat the request with a suitable Authorization header field. If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials. If the 401 response contains the same challenge as the prior response, and the user agent has already attempted authentication at least once, then the user SHOULD be presented the entity that was given in the response, since that entity might include relevant diagnostic information. HTTP access authentication is explained in \"HTTP Authentication: Basic and Digest Access Authentication\".",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":unauthorized"
								}
							}
						},
						"402" : {
							"code"         : "402",
							"title"        : "Payment Required",
							"summary"      : "payment required, reserved for future use",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, but that has not happened, and this code is not usually used. As an example of its use, however, Apple's MobileMe service generates a 402 error (\"httpStatusCode:402\" in the Mac OS X Console log) if the MobileMe account is delinquent.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#402"
								},
								"ietf"      : {
									"body" : "This code is reserved for future use.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":payment_required"
								}
							}
						},
						"403" : {
							"code"         : "403",
							"title"        : "Forbidden",
							"summary"      : "server refuses to respond to request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request was a legal request, but the server is refusing to respond to it. Unlike a 401 Unauthorized response, authenticating will make no difference.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#403"
								},
								"ietf"      : {
									"body" : "The server understood the request, but is refusing to fulfill it. Authorization will not help and the request SHOULD NOT be repeated. If the request method was not HEAD and the server wishes to make public why the request has not been fulfilled, it SHOULD describe the reason for the refusal in the entity. If the server does not wish to make this information available to the client, the status code 404 (Not Found) can be used instead.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":forbidden"
								}
							}
						},
						"404" : {
							"code"         : "404",
							"title"        : "Not Found",
							"summary"      : "requested resource could not be found",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The requested resource could not be found but may be available again in the future. Subsequent requests by the client are permissible.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#404"
								},
								"ietf"      : {
									"body" : "The server has not found anything matching the Request-URI. No indication is given of whether the condition is temporary or permanent. The 410 (Gone) status code SHOULD be used if the server knows, through some internally configurable mechanism, that an old resource is permanently unavailable and has no forwarding address. This status code is commonly used when the server does not wish to reveal exactly why the request has been refused, or when no other response is applicable.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":not_found"
								}
							}
						},
						"405" : {
							"code"         : "405",
							"title"        : "Method Not Allowed",
							"summary"      : "request method not supported by that resource",
							"descriptions" : {
								"wikipedia" : {
									"body" : "A request was made of a resource using a request method not supported by that resource; for example, using GET on a form which requires data to be presented via POST, or using PUT on a read-only resource.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#405"
								},
								"ietf"      : {
									"body" : "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI. The response MUST include an Allow header containing a list of valid methods for the requested resource.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":method_not_allowed"
								}
							}
						},
						"406" : {
							"code"         : "406",
							"title"        : "Not Acceptable",
							"summary"      : "content not acceptable according to the Accept headers",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#406"
								},
								"ietf"      : {
									"body" : "The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.\r\nUnless it was a HEAD request, the response SHOULD include an entity containing a list of available entity characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media type given in the Content-Type header field. Depending upon the format and the capabilities of the user agent, selection of the most appropriate choice MAY be performed automatically. However, this specification does not define any standard for such automatic selection.\r\nNote: HTTP\/1.1 servers are allowed to return responses which are not acceptable according to the accept headers sent in the request. In some cases, this may even be preferable to sending a 406 response. User agents are encouraged to inspect the headers of an incoming response to determine if it is acceptable.\r\nIf the response could be unacceptable, a user agent SHOULD temporarily stop receipt of more data and query the user for a decision on further actions.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":not_acceptable"
								}
							}
						},
						"407" : {
							"code"         : "407",
							"title"        : "Proxy Authentication Required",
							"summary"      : "client must first authenticate itself with the proxy",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The client must first authenticate itself with the proxy.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#407"
								},
								"ietf"      : {
									"body" : "This code is similar to 401 (Unauthorized), but indicates that the client must first authenticate itself with the proxy. The proxy MUST return a Proxy-Authenticate header field containing a challenge applicable to the proxy for the requested resource. The client MAY repeat the request with a suitable Proxy-Authorization header field. HTTP access authentication is explained in \"HTTP Authentication: Basic and Digest Access Authentication\".",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":proxy_authentication_required"
								}
							}
						},
						"408" : {
							"code"         : "408",
							"title"        : "Request Timeout",
							"summary"      : "server timed out waiting for the request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server timed out waiting for the request. According to W3 HTTP specifications: \"The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.\"",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#408"
								},
								"ietf"      : {
									"body" : "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":request_timeout"
								}
							}
						},
						"409" : {
							"code"         : "409",
							"title"        : "Conflict",
							"summary"      : "request could not be processed because of conflict",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Indicates that the request could not be processed because of conflict in the request, such as an edit conflict.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#409"
								},
								"ietf"      : {
									"body" : "The request could not be completed due to a conflict with the current state of the resource. This code is only allowed in situations where it is expected that the user might be able to resolve the conflict and resubmit the request. The response body SHOULD include enough information for the user to recognize the source of the conflict. Ideally, the response entity would include enough information for the user or user agent to fix the problem; however, that might not be possible and is not required.\r\nConflicts are most likely to occur in response to a PUT request. For example, if versioning were being used and the entity being PUT included changes to a resource which conflict with those made by an earlier (third-party) request, the server might use the 409 response to indicate that it can't complete the request. In this case, the response entity would likely contain a list of the differences between the two versions in a format defined by the response Content-Type.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":conflict"
								}
							}
						},
						"410" : {
							"code"         : "410",
							"title"        : "Gone",
							"summary"      : "resource is no longer available and will not be available again",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource again in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a \"404 Not Found\" may be used instead.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#410"
								},
								"ietf"      : {
									"body" : "The requested resource is no longer available at the server and no forwarding address is known. This condition is expected to be considered permanent. Clients with link editing capabilities SHOULD delete references to the Request-URI after user approval. If the server does not know, or has no facility to determine, whether or not the condition is permanent, the status code 404 (Not Found) SHOULD be used instead. This response is cacheable unless indicated otherwise.\r\nThe 410 response is primarily intended to assist the task of web maintenance by notifying the recipient that the resource is intentionally unavailable and that the server owners desire that remote links to that resource be removed. Such an event is common for limited-time, promotional services and for resources belonging to individuals no longer working at the server's site. It is not necessary to mark all permanently unavailable resources as \"gone\" or to keep the mark for any length of time -- that is left to the discretion of the server owner.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":gone"
								}
							}
						},
						"411" : {
							"code"         : "411",
							"title"        : "Length Required",
							"summary"      : "request did not specify the length of its content",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request did not specify the length of its content, which is required by the requested resource.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#411"
								},
								"ietf"      : {
									"body" : "The server refuses to accept the request without a defined Content- Length. The client MAY repeat the request if it adds a valid Content-Length header field containing the length of the message-body in the request message.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":length_required"
								}
							}
						},
						"412" : {
							"code"         : "412",
							"title"        : "Precondition Failed",
							"summary"      : "server does not meet request preconditions",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server does not meet one of the preconditions that the requester put on the request.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#412"
								},
								"ietf"      : {
									"body" : "The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server. This response code allows the client to place preconditions on the current resource metainformation (header field data) and thus prevent the requested method from being applied to a resource other than the one intended.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":precondition_failed"
								}
							}
						},
						"413" : {
							"code"         : "413",
							"title"        : "Request Entity Too Large",
							"summary"      : "request is larger than the server is willing or able to process",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request is larger than the server is willing or able to process.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#413"
								},
								"ietf"      : {
									"body" : "The server is refusing to process a request because the request entity is larger than the server is willing or able to process. The server MAY close the connection to prevent the client from continuing the request.\r\nIf the condition is temporary, the server SHOULD include a Retry- After header field to indicate that it is temporary and after what time the client MAY try again.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":request_entity_too_large"
								}
							}
						},
						"414" : {
							"code"         : "414",
							"title"        : "Request-URI Too Long",
							"summary"      : "URI provided was too long for the server to process",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The URI provided was too long for the server to process.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#414"
								},
								"ietf"      : {
									"body" : "The server is refusing to service the request because the Request-URI is longer than the server is willing to interpret. This rare condition is only likely to occur when a client has improperly converted a POST request to a GET request with long query information, when the client has descended into a URI \"black hole\" of redirection (e.g., a redirected URI prefix that points to a suffix of itself), or when the server is under attack by a client attempting to exploit security holes present in some servers using fixed-length buffers for reading or manipulating the Request-URI.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":request_uri_too_long"
								}
							}
						},
						"415" : {
							"code"         : "415",
							"title"        : "Unsupported Media Type",
							"summary"      : "server does not support media type",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image\/svg+xml, but the server requires that images use a different format.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#415"
								},
								"ietf"      : {
									"body" : "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":unsupported_media_type"
								}
							}
						},
						"416" : {
							"code"         : "416",
							"title"        : "Requested Range Not Satisfiable",
							"summary"      : "client has asked for unprovidable portion of the file",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The client has asked for a portion of the file, but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#416"
								},
								"ietf"      : {
									"body" : "A server SHOULD return a response with this status code if a request included a Range request-header field, and none of the range-specifier values in this field overlap the current extent of the selected resource, and the request did not include an If-Range request-header field. (For byte-ranges, this means that the first- byte-pos of all of the byte-range-spec values were greater than the current length of the selected resource.)\r\nWhen this status code is returned for a byte-range request, the response SHOULD include a Content-Range entity-header field specifying the current length of the selected resource. This response MUST NOT use the multipart\/byteranges content- type.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":requested_range_not_satisfiable"
								}
							}
						},
						"417" : {
							"code"         : "417",
							"title"        : "Expectation Failed",
							"summary"      : "server cannot meet requirements of Expect request-header field",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server cannot meet the requirements of the Expect request-header field.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#417"
								},
								"ietf"      : {
									"body" : "The expectation given in an Expect request-header field could not be met by this server, or, if the server is a proxy, the server has unambiguous evidence that the request could not be met by the next-hop server.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":expectation_failed"
								}
							}
						},
						"418" : {
							"code"         : "418",
							"title"        : "I'm a teapot (RFC 2324)",
							"summary"      : "I'm a teapot",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. However, known implementations do exist. An Nginx HTTP server uses this code to simulate goto-like behaviour in its configuration.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#418"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":\"i'm_a_teapot\" <small>(<a href=\"https://gist.github.com/3134563\">explanation<\/a> <sup>gist.github.com<\/sup>)<\/small>"
								}
							}
						},
						"420" : {
							"code"         : "420",
							"title"        : "Enhance Your Calm",
							"summary"      : "Twitter rate limiting",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Returned by the Twitter Search and Trends API when the client is being rate limited.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#420"
								}
							}
						},
						"422" : {
							"code"         : "422",
							"title"        : "Unprocessable Entity (WebDAV) (RFC 4918)",
							"summary"      : "request unable to be followed due to semantic errors",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request was well-formed but was unable to be followed due to semantic errors.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#422"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":unprocessable_entity"
								}
							}
						},
						"423" : {
							"code"         : "423",
							"title"        : "Locked (WebDAV) (RFC 4918)",
							"summary"      : "resource that is being accessed is locked",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The resource that is being accessed is locked.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#423"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":locked"
								}
							}
						},
						"424" : {
							"code"         : "424",
							"title"        : "Failed Dependency (WebDAV) (RFC 4918)",
							"summary"      : "request failed due to failure of a previous request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The request failed due to failure of a previous request (e.g. a PROPPATCH).",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#424"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":failed_dependency"
								}
							}
						},
						"426" : {
							"code"         : "426",
							"title"        : "Upgrade Required (RFC 2817)",
							"summary"      : "client should switch to a different protocol",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The client should switch to a different protocol such as TLS\/1.0.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#426"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":upgrade_required"
								}
							}
						},
						"428" : {
							"code"         : "428",
							"title"        : "Precondition Required",
							"summary"      : "origin server requires the request to be conditional",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The origin server requires the request to be conditional. Intended to prevent \"the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.\" Proposed in an Internet-Draft.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#428"
								}
							}
						},
						"429" : {
							"code"         : "429",
							"title"        : "Too Many Requests",
							"summary"      : "user has sent too many requests in a given amount of time",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes. Proposed in an Internet-Draft.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#429"
								}
							}
						},
						"431" : {
							"code"         : "431",
							"title"        : "Request Header Fields Too Large",
							"summary"      : "server is unwilling to process the request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large. Proposed in an Internet-Draft.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#431"
								}
							}
						},
						"444" : {
							"code"         : "444",
							"title"        : "No Response",
							"summary"      : "server returns no information and closes the connection",
							"descriptions" : {
								"wikipedia" : {
									"body" : "An nginx HTTP server extension. The server returns no information to the client and closes the connection (useful as a deterrent for malware).",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#444"
								}
							}
						},
						"449" : {
							"code"         : "449",
							"title"        : "Retry With",
							"summary"      : "request should be retried after performing action",
							"descriptions" : {
								"wikipedia" : {
									"body" : "A Microsoft extension. The request should be retried after performing the appropriate action.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#449"
								}
							}
						},
						"450" : {
							"code"         : "450",
							"title"        : "Blocked by Windows Parental Controls",
							"summary"      : "Windows Parental Controls blocking access to webpage",
							"descriptions" : {
								"wikipedia" : {
									"body" : "A Microsoft extension. This error is given when Windows Parental Controls are turned on and are blocking access to the given webpage.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#450"
								}
							}
						},
						"451" : {
							"code"         : "451",
							"title"        : "Wrong Exchange server",
							"summary"      : "The server cannot reach the client's mailbox.",
							"descriptions" : {
								"MS-ASHTTP" : {
									"body" : "If the client is attempting to connect to the wrong server (that is, a server that cannot access the user's mailbox), or if there is a more efficient server to use to reach the user's mailbox, then a 451 Redirect error is returned.",
									"link" : "http://msdn.microsoft.com/en-us/library/gg651019"
								}
							}
						},
						"499" : {
							"code"         : "499",
							"title"        : "Client Closed Request",
							"summary"      : "connection closed by client while HTTP server is processing",
							"descriptions" : {
								"wikipedia" : {
									"body" : "An Nginx HTTP server extension. This code is introduced to log the case when the connection is closed by client while HTTP server is processing its request, making server unable to send the HTTP header back.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#499"
								}
							}
						},
						"500" : {
							"code"         : "500",
							"title"        : "Internal Server Error",
							"summary"      : "generic error message",
							"descriptions" : {
								"wikipedia" : {
									"body" : "A generic error message, given when no more specific message is suitable.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#500"
								},
								"ietf"      : {
									"body" : "The server encountered an unexpected condition which prevented it from fulfilling the request.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":internal_server_error"
								}
							}
						},
						"501" : {
							"code"         : "501",
							"title"        : "Not Implemented",
							"summary"      : "server does not recognise method or lacks ability to fulfill",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server either does not recognise the request method, or it lacks the ability to fulfill the request.[2]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#501"
								},
								"ietf"      : {
									"body" : "The server does not support the functionality required to fulfill the request. This is the appropriate response when the server does not recognize the request method and is not capable of supporting it for any resource.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":not_implemented"
								}
							}
						},
						"502" : {
							"code"         : "502",
							"title"        : "Bad Gateway",
							"summary"      : "server received an invalid response from upstream server",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server was acting as a gateway or proxy and received an invalid response from the upstream server.[2]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#502"
								},
								"ietf"      : {
									"body" : "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":bad_gateway"
								}
							}
						},
						"503" : {
							"code"         : "503",
							"title"        : "Service Unavailable",
							"summary"      : "server is currently unavailable",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server is currently unavailable (because it is overloaded or down for maintenance).[2] Generally, this is a temporary state.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#503"
								},
								"ietf"      : {
									"body" : "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server. The implication is that this is a temporary condition which will be alleviated after some delay. If known, the length of the delay MAY be indicated in a Retry-After header. If no Retry-After is given, the client SHOULD handle the response as it would for a 500 response.\r\nNote: The existence of the 503 status code does not imply that a server must use it when becoming overloaded. Some servers may wish to simply refuse the connection.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":service_unavailable"
								}
							}
						},
						"504" : {
							"code"         : "504",
							"title"        : "Gateway Timeout",
							"summary"      : "gateway did not receive response from upstream server",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.[2]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#504"
								},
								"ietf"      : {
									"body" : "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI (e.g. HTTP, FTP, LDAP) or some other auxiliary server (e.g. DNS) it needed to access in attempting to complete the request.\r\nNote: Note to implementors: some deployed proxies are known to return 400 or 500 when DNS lookups time out.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":gateway_timeout"
								}
							}
						},
						"505" : {
							"code"         : "505",
							"title"        : "HTTP Version Not Supported",
							"summary"      : "server does not support the HTTP protocol version",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server does not support the HTTP protocol version used in the request.[2]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#505"
								},
								"ietf"      : {
									"body" : "The server does not support, or refuses to support, the HTTP protocol version that was used in the request message. The server is indicating that it is unable or unwilling to complete the request using the same major version as the client. The response SHOULD contain an entity describing why that version is not supported and what other protocols are supported by that server.",
									"link" : "http:\/\/www.ietf.org\/rfc\/rfc2616.txt"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":http_version_not_supported"
								}
							}
						},
						"506" : {
							"code"         : "506",
							"title"        : "Variant Also Negotiates (RFC 2295)",
							"summary"      : "content negotiation for the request results in a circular reference",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Transparent content negotiation for the request results in a circular reference.[23]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#506"
								}
							}
						},
						"507" : {
							"code"         : "507",
							"title"        : "Insufficient Storage (WebDAV) (RFC 4918)",
							"summary"      : "server is unable to store the representation",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server is unable to store the representation needed to complete the request.[7]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#507"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":insufficient_storage"
								}
							}
						},
						"508" : {
							"code"         : "508",
							"title"        : "Loop Detected (WebDAV) (RFC 5842)",
							"summary"      : "server detected an infinite loop while processing the request",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The server detected an infinite loop while processing the request (sent in lieu of 208).",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#508"
								}
							}
						},
						"509" : {
							"code"         : "509",
							"title"        : "Bandwidth Limit Exceeded (Apache bw\/limited extension)",
							"summary"      : "bandwidth limit exceeded",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This status code, while used by many servers, is not specified in any RFCs.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#509"
								}
							}
						},
						"510" : {
							"code"         : "510",
							"title"        : "Not Extended (RFC 2774)",
							"summary"      : "further extensions to the request are required",
							"descriptions" : {
								"wikipedia" : {
									"body" : "Further extensions to the request are required for the server to fulfill it.[24]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#510"
								}
							},
							"references"   : {
								"rails" : {
									"title" : "Rails HTTP Status Symbol",
									"value" : ":not_extended"
								}
							}
						},
						"511" : {
							"code"         : "511",
							"title"        : "Network Authentication Required",
							"summary"      : "client needs to authenticate to gain network access",
							"descriptions" : {
								"wikipedia" : {
									"body" : "The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g. \"captive portals\" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot). Proposed in an Internet-Draft.[19]",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#511"
								}
							}
						},
						"598" : {
							"code"         : "598",
							"title"        : "Network read timeout error",
							"summary"      : "network read timeout behind the proxy ",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This status code is not specified in any RFCs, but is used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#598"
								}
							}
						},
						"599" : {
							"code"         : "599",
							"title"        : "Network connect timeout error",
							"summary"      : "network connect timeout behind the proxy",
							"descriptions" : {
								"wikipedia" : {
									"body" : "This status code is not specified in any RFCs, but is used by some HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.",
									"link" : "http:\/\/en.wikipedia.org\/wiki\/List_of_HTTP_status_codes#599"
								}
							}
						},
						"601" : {
							"code"    : "601",
							"title"   : "Fatal Error",
							"summary" : message || "A fatal error has occurred but isn't specified for some reason."
						},
						"602" : {
							"code"    : "602",
							"title"   : "Non-fatal Error",
							"summary" : message || "A non-fatal error has occurred but isn't specified for some reason."
						}
					};

				if (_.has(errorCodes, code))
					result = errorCodes[code];

				return result;
			};

			// If no message was sent, find the default error for the code
			var result = checkCode(code);

			// We only want to auto debug any of the custom error codes. All other resulting error codes likely should be filtered into log messages based on feedback that should be relayed to the user.
			if (code >= 600)
				Slipstream.debug.error("error(" + result.code + ", " + result.title + ': ' + result.summary, objects);

			throw new Meteor.Error(code, message);
		}
	};
}());
