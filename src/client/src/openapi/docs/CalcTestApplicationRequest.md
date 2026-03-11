# CalcTestApplicationRequest

工数計算リクエスト

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectName** | **string** | 案件名 | [optional] [default to undefined]
**autoProductivity** | **boolean** | 生産性自動計算フラグ | [optional] [default to undefined]
**productivityFPPerMonth** | **number** | 生産性（FP/月） | [optional] [default to undefined]
**projectType** | **string** | 案件種別 | [optional] [default to undefined]
**ipaValueType** | **string** | 使用するIPA代表値 | [optional] [default to undefined]
**autoProcessRatios** | **boolean** | 開発工程比率自動入力フラグ | [optional] [default to undefined]
**dataFunctions** | [**Array&lt;CalcTestApplication200ResponseDataFunctionsInner&gt;**](CalcTestApplication200ResponseDataFunctionsInner.md) | :データファンクション情報 | [optional] [default to undefined]
**transactionFunctions** | [**Array&lt;CalcTestApplication200ResponseTransactionFunctionsInner&gt;**](CalcTestApplication200ResponseTransactionFunctionsInner.md) | トランザクションファンクション情報 | [optional] [default to undefined]
**processRatios** | [**CalcTestApplication200ResponseProcessRatios**](CalcTestApplication200ResponseProcessRatios.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CalcTestApplicationRequest } from './api';

const instance: CalcTestApplicationRequest = {
    projectName,
    autoProductivity,
    productivityFPPerMonth,
    projectType,
    ipaValueType,
    autoProcessRatios,
    dataFunctions,
    transactionFunctions,
    processRatios,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
