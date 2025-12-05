# TestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTESTTestPost**](#apitesttestpost) | **POST** /api/TEST/test | テスト|

# **apiTESTTestPost**
> User apiTESTTestPost(user)


### Example

```typescript
import {
    TestApi,
    Configuration,
    User
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

let user: User; //

const { status, data } = await apiInstance.apiTESTTestPost(
    user
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **user** | **User**|  | |


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | テスト |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

