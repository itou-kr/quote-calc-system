# CalcTestApplicationRequest

工数計算リクエスト

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** |  | [optional] [default to undefined]
**productivityFPPerMonth** | **number** |  | [optional] [default to undefined]
**projectType** | **string** |  | [optional] [default to undefined]
**ipaValueType** | **string** |  | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;CalcTestApplicationRequestDataFunctionsInner&gt;**](CalcTestApplicationRequestDataFunctionsInner.md) |  | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;CalcTestApplicationRequestTransactionFunctionsInner&gt;**](CalcTestApplicationRequestTransactionFunctionsInner.md) |  | [optional] [default to undefined]
**processRatios** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CalcTestApplicationRequest } from './api';

const instance: CalcTestApplicationRequest = {
    projectName,
    productivityFPPerMonth,
    projectType,
    ipaValueType,
    dataFunctions,
    transactionFunctions,
    processRatios,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
