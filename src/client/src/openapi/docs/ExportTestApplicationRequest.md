# ExportTestApplicationRequest

エクスポートリクエスト

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** |  | [optional] [default to undefined]
**productivityFPPerMonth** | **number** |  | [optional] [default to undefined]
**projectType** | **string** |  | [optional] [default to undefined]
**ipaValueType** | **string** |  | [optional] [default to undefined]
**importFile** | [**CalcTestApplication200ResponseImportFile**](CalcTestApplication200ResponseImportFile.md) |  | [optional] [default to undefined]
**exportFile** | [**CalcTestApplication200ResponseImportFile**](CalcTestApplication200ResponseImportFile.md) |  | [optional] [default to undefined]
**totalFP** | **number** |  | [optional] [default to undefined]
**manMonth** | **number** |  | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;CalcTestApplication200ResponseDataFunctionsInner&gt;**](CalcTestApplication200ResponseDataFunctionsInner.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ExportTestApplicationRequest } from './api';

const instance: ExportTestApplicationRequest = {
    projectName,
    productivityFPPerMonth,
    projectType,
    ipaValueType,
    importFile,
    exportFile,
    totalFP,
    manMonth,
    dataFunctions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
