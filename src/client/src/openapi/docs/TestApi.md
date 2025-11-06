# TestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTESTTestGet**](#apitesttestget) | **GET** /api/TEST/test | テスト|
|[**apiTESTTestPost**](#apitesttestpost) | **POST** /api/TEST/test | テスト|

# **apiTESTTestGet**
> Array<User> apiTESTTestGet()


### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

const { status, data } = await apiInstance.apiTESTTestGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<User>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | テスト |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

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

