# Event template

## Getting Started:

### Using Serverless:
Create a file at the root of your serverless project called s-templates.json with the following code:
```
{
  "lambWrapTemplate": {
    "application/json": "{\n \"body\" : $input.json('$'),\n \"headers\": {\n #foreach($header in $input.params().header.keySet())\n \"$header\": \"$util.escapeJavaScript($input.params().header.get($header))\" #if($foreach.hasNext),#end\n \n #end\n },\n \"method\": \"$context.httpMethod\",\n \"resourcePath\": \"$context.resourcePath\",\n \"source\": \"aws.apiGateway\",\n \"pathParams\": {\n #foreach($param in $input.params().path.keySet())\n \"$param\": \"$util.escapeJavaScript($input.params().path.get($param))\" #if($foreach.hasNext),#end\n \n #end\n },\n \"queryParams\": {\n #foreach($queryParam in $input.params().querystring.keySet())\n \"$queryParam\": \"$util.escapeJavaScript($input.params().querystring.get($queryParam))\" #if($foreach.hasNext),#end\n \n #end\n } \n}" 
  }
}
```
At your s-function-json specify your resquestTemplates as lambWrapTemplate.
```
"requestTemplates": "$${apiGatewayRequestTemplate}"
```

### Without frameworks:
- Go to your AWS console and enter into API Gateway dashboard.
- Select your project and the desired endpoint.
- Click on the Integration Request option.
- Expand body mapping templates.
- Select application/json and paste following code: 
```
{
  "lambWrapTemplate": {
    "application/json": "{\n \"body\" : $input.json('$'),\n \"headers\": {\n #foreach($header in $input.params().header.keySet())\n \"$header\": \"$util.escapeJavaScript($input.params().header.get($header))\" #if($foreach.hasNext),#end\n \n #end\n },\n \"method\": \"$context.httpMethod\",\n \"resourcePath\": \"$context.resourcePath\",\n \"source\": \"aws.apiGateway\",\n \"pathParams\": {\n #foreach($param in $input.params().path.keySet())\n \"$param\": \"$util.escapeJavaScript($input.params().path.get($param))\" #if($foreach.hasNext),#end\n \n #end\n },\n \"queryParams\": {\n #foreach($queryParam in $input.params().querystring.keySet())\n \"$queryParam\": \"$util.escapeJavaScript($input.params().querystring.get($queryParam))\" #if($foreach.hasNext),#end\n \n #end\n } \n}" 
  }
}
```
- Save and test your endpoint 


## Expected Result:
![Expected Event](http://i.imgur.com/fF2lnip.png)


