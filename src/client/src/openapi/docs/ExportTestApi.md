# ExportTestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**exportTestApplication**](#exporttestapplication) | **POST** /TEST/exportTest | エクスポート|

# **exportTestApplication**
> ExportTestApplication200Response exportTestApplication(exportTestApplicationRequest)

...

### Example

```typescript
import {
    ExportTestApi,
    Configuration,
    ExportTestApplicationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ExportTestApi(configuration);

let exportTestApplicationRequest: ExportTestApplicationRequest; //...

const { status, data } = await apiInstance.exportTestApplication(
    exportTestApplicationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **exportTestApplicationRequest** | **ExportTestApplicationRequest**| ... | |


### Return type

**ExportTestApplication200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ... |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

