# ExportApplicationRequest

エクスポートリクエスト

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** | 案件名 | [optional] [default to undefined]
**productivityFPPerMonth** | **number** | 生産性（FP/月） | [optional] [default to undefined]
**projectType** | **string** | 案件種別 | [optional] [default to undefined]
**ipaValueType** | **string** | 使用するIPA代表値 | [optional] [default to undefined]
**totalFP** | **number** | 総FP | [optional] [default to undefined]
**totalManMonths** | **number** | 工数（人月） | [optional] [default to undefined]
**standardDurationMonths** | **number** | 標準工期（月） | [optional] [default to undefined]
**processRatios** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**processManMonths** | [**CalcTestApplication200ResponseProcessManMonths**](CalcTestApplication200ResponseProcessManMonths.md) |  | [optional] [default to undefined]
**processDurations** | [**CalcTestApplication200ResponseProcessDurations**](CalcTestApplication200ResponseProcessDurations.md) |  | [optional] [default to undefined]
**exportFile** | [**ExportApplicationRequestExportFile**](ExportApplicationRequestExportFile.md) |  | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;ExportApplicationRequestDataFunctionsInner&gt;**](ExportApplicationRequestDataFunctionsInner.md) |  | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;ExportApplicationRequestTransactionFunctionsInner&gt;**](ExportApplicationRequestTransactionFunctionsInner.md) |  | [optional] [default to undefined]

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
    exportFile,
    dataFunctions,
    transactionFunctions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
