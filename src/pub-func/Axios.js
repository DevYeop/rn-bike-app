/ 공통 함수
export async function PrevPostRequest({
  baseURL = API_BASE_URL(),
  endPoint,
  params,
  useToken,
  appendFiles,
  timeout = 10000,
  successed,
  failed,
}: {
  baseURL?: string;
  endPoint: string;
  params?: any;
  useToken?: boolean;
  timeout?: number;
  appendFiles?: any[];
  successed: (data: any) => void;
  failed: (errCode: number, message: string) => void;
}): Promise<any> {
  if (getValidObject(POSTED_END_POINTS, endPoint) !== true) {
    POSTED_END_POINTS[endPoint] = true;
    const isValidParams = isValidObject(params);
    const formData = isValidParams || useToken ? new FormData() : undefined;
    if (isValidParams) {
      Object.keys(params).forEach((key: string) => {
        formData.append(key, params[key]);
      });
    }
    // 토큰을 사용하는 API
    if (useToken) {
      formData.append(‘user_id’, GetUserId());
      formData.append(‘sign’, GetToken());
    }
    if (isValidArray(appendFiles)) {
      appendFiles.map(appendFile => {
        const appendFileData = getArgumentExceptObject(appendFile, ‘key’);
        formData.append(getValidObject(appendFile, ‘key’), appendFileData);
      });
    }
    ConsoleLog(‘platform = ’, platform, ‘APP_VERSION = ’, APP_VERSION);
    return instance
      .post(
        `${endPoint}&fromApi=${platform}&version=${APP_VERSION}`,
        formData,
        {
          baseURL,
          timeout,
        },
      )
      .then(response => {
        POSTED_END_POINTS[endPoint] = false;
        const data = getValidObject(response, ‘data’);
        // const dataString = JSON.stringify(data);
        if (getValidObject(data, ‘errorCode’) === 0) {
          const successedData = getValidObject(data, ‘data’);
          if (isValidObject(successedData)) {
            successed(successedData);
          } else {
            failed(ERROR_CODE.INVALID_DATA, ‘Invalid Data’);
          }
        } else {
          failed(
            getValidObject(data, ‘errorCode’),
            getValidObject(data, ‘msg’),
          );
        }
      })
      .catch(reason => {
        POSTED_END_POINTS[endPoint] = false;
        const message: string = getValidObject(reason, ‘message’);
        if (
          getValidObject(reason, ‘code’) === ‘ECONNABORTED’ &&
          isValidString(message) &&
          message.indexOf(‘timeout of’) === 0
        ) {
          //
          failed(ERROR_CODE.TIMEOUT, `Time out : ${timeout}`);
        } else {
          failed(ERROR_CODE.UNKNOWN, message);
        }
      });
  } else {
    ConsoleLog(‘이미 실행되고 있는 API 입니다. ’, endPoint);
  }
}