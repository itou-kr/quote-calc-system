# ExportApplicationRequest

エクスポートリクエスト

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** |  | [optional] [default to undefined]
**productivityFPPerMonth** | **number** |  | [optional] [default to undefined]
**projectType** | **string** |  | [optional] [default to undefined]
**ipaValueType** | **string** |  | [optional] [default to undefined]
**totalFP** | **number** |  | [optional] [default to undefined]
**totalManMonths** | **number** |  | [optional] [default to undefined]
**standardDurationMonths** | **number** |  | [optional] [default to undefined]
**processRatios** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**processManMonths** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**processDurations** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**importFile** | [**ExportApplicationRequestImportFile**](ExportApplicationRequestImportFile.md) |  | [optional] [default to undefined]
**exportFile** | [**ExportApplicationRequestImportFile**](ExportApplicationRequestImportFile.md) |  | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;CalcTestApplication200ResponseDataFunctionsInner&gt;**](CalcTestApplication200ResponseDataFunctionsInner.md) |  | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;CalcTestApplication200ResponseTransactionFunctionsInner&gt;**](CalcTestApplication200ResponseTransactionFunctionsInner.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ExportApplicationRequest } from './api';

const instance: ExportApplicationRequest = {
    projectName,
    productivityFPPerMonth,
    projectType,
    ipaValueType,
    totalFP,
    totalManMonths,
    standardDurationMonths,
    processRatios,
    processManMonths,
    processDurations,
    importFile,
    exportFile,
    dataFunctions,
    transactionFunctions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
