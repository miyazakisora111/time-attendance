export enum ApiErrorTitle {
  /** 入力エラー */
  Validation = '入力内容を確認してください',
  /** サーバーエラー */
  Server = 'サーバーエラー',
  /** ネットワークエラー */
  Network = '通信エラー',
}

/**
 * APIエラー表示メッセージ。
 */
export enum ApiErrorMessage {
  /** 422/4xx のデフォルト */
  RequestFailed = 'リクエストが処理できませんでした。',
  /** 5xx のデフォルト */
  ServerError = 'サーバーエラーが発生しました。時間をおいて再度お試しください。',
  /** その他 */
  GenericError = 'エラーが発生しました。',
  /** ネットワークエラー */
  NetworkError = 'ネットワークエラーが発生しました。接続を確認してください。',
}
