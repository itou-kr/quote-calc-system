# CalcTestApplication200Response

工数計算レスポンス

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** | 案件名 | [optional] [default to undefined]
**productivityFPPerMonth** | **number** | 生産性（FP/月） | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;CalcTestApplication200ResponseDataFunctionsInner&gt;**](CalcTestApplication200ResponseDataFunctionsInner.md) | :データファンクション情報 | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;CalcTestApplication200ResponseTransactionFunctionsInner&gt;**](CalcTestApplication200ResponseTransactionFunctionsInner.md) | トランザクションファンクション情報 | [optional] [default to undefined]
**totalFP** | **number** | 総FP | [optional] [default to undefined]
**totalManMonths** | **number** | 工数（人月） | [optional] [default to undefined]
**standardDurationMonths** | **number** | 標準工期（月） | [optional] [default to undefined]
**processRatios** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]
**processFPs** | [**CalcTestApplication200ResponseProcessFPs**](CalcTestApplication200ResponseProcessFPs.md) |  | [optional] [default to undefined]
**processManMonths** | [**CalcTestApplication200ResponseProcessManMonths**](CalcTestApplication200ResponseProcessManMonths.md) |  | [optional] [default to undefined]
**processDurations** | [**CalcTestApplication200ResponseProcessDurations**](CalcTestApplication200ResponseProcessDurations.md) |  | [optional] [default to undefined]
**errorMessages** | **Array&lt;string&gt;** | エラーメッセージ | [optional] [default to undefined]

## Example

```typescript
import { CalcTestApplication200Response } from './api';

const instance: CalcTestApplication200Response = {
    projectName,
    productivityFPPerMonth,
    dataFunctions,
    transactionFunctions,
    totalFP,
    totalManMonths,
    standardDurationMonths,
    processRatios,
    processFPs,
    processManMonths,
    processDurations,
    errorMessages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
