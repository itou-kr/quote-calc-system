# ExportApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**exportApplication**](#exportapplication) | **POST** /TEST/export | エクスポート|

# **exportApplication**
> ExportApplication200Response exportApplication(exportApplicationRequest)

...

### Example

```typescript
import {
    ExportApi,
    Configuration,
    ExportApplicationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ExportApi(configuration);

let exportApplicationRequest: ExportApplicationRequest; //...

const { status, data } = await apiInstance.exportApplication(
    exportApplicationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **exportApplicationRequest** | **ExportApplicationRequest**| ... | |


### Return type

**ExportApplication200Response**

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

