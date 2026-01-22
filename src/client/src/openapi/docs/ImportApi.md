# ImportApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**importApplication**](#importapplication) | **POST** /TEST/import | インポート|

# **importApplication**
> ImportApplication200Response importApplication()

...

### Example

```typescript
import {
    ImportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImportApi(configuration);

let file: File; //Excel file (default to undefined)

const { status, data } = await apiInstance.importApplication(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | Excel file | defaults to undefined|


### Return type

**ImportApplication200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ... |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

