# CalcApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**calcTestApplication**](#calctestapplication) | **POST** /api/TEST/calc | 工数計算|

# **calcTestApplication**
> CalcTestApplication200Response calcTestApplication(calcTestApplicationRequest)

...

### Example

```typescript
import {
    CalcApi,
    Configuration,
    CalcTestApplicationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CalcApi(configuration);

let calcTestApplicationRequest: CalcTestApplicationRequest; //...

const { status, data } = await apiInstance.calcTestApplication(
    calcTestApplicationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calcTestApplicationRequest** | **CalcTestApplicationRequest**| ... | |


### Return type

**CalcTestApplication200Response**

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

