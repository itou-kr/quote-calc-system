# ImportApplication200Response

インポートレスポンス

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** |  | [default to undefined]
**productivityFPPerMonth** | **number** |  | [default to undefined]
**projectType** | **string** |  | [default to undefined]
**ipaValueType** | **string** |  | [default to undefined]
**totalFP** | **number** |  | [optional] [default to undefined]
**totalManMonths** | **number** |  | [optional] [default to undefined]
**standardDurationMonths** | **number** |  | [optional] [default to undefined]
**processRatios** | [**ImportApplication200ResponseProcessRatios**](ImportApplication200ResponseProcessRatios.md) |  | [default to undefined]
**displayedProcessRatios** | [**CalcTestApplication200ResponseDisplayedProcessRatios**](CalcTestApplication200ResponseDisplayedProcessRatios.md) |  | [optional] [default to undefined]
**processFPs** | [**CalcTestApplication200ResponseProcessFPs**](CalcTestApplication200ResponseProcessFPs.md) |  | [optional] [default to undefined]
**processManMonths** | [**ImportApplication200ResponseProcessRatios**](ImportApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**processDurations** | [**ImportApplication200ResponseProcessRatios**](ImportApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;ExportApplication200ResponseDataFunctionsInner&gt;**](ExportApplication200ResponseDataFunctionsInner.md) |  | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;ExportApplicationRequestTransactionFunctionsInner&gt;**](ExportApplicationRequestTransactionFunctionsInner.md) |  | [optional] [default to undefined]
**errorMessages** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { ImportApplication200Response } from './api';

const instance: ImportApplication200Response = {
    projectName,
    productivityFPPerMonth,
    projectType,
    ipaValueType,
    totalFP,
    totalManMonths,
    standardDurationMonths,
    processRatios,
    displayedProcessRatios,
    processFPs,
    processManMonths,
    processDurations,
    dataFunctions,
    transactionFunctions,
    errorMessages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
