# 未実装機能一覧

> **作成日**: 2025-01  
> **分析範囲**: DB スキーマ / Backend (Controller・Service・Model) / OpenAPI 定義 / Frontend UI  
> **分析方針**: DB テーブル・カラムが「本来実装されるべき機能のヒント」。既存コードは信用せず全レイヤーを横断的に検証。

---

## 凡例

| ラベル | 意味 |
|--------|------|
| ❌ 完全未実装 | DB やスキーマ定義は存在するが、動作する実装が一切ない |
| ⚠️ 部分実装 | 一部レイヤーのみ実装済み。ユーザーが期待する操作が完了しない |
| ❗ 設計不整合 | レイヤー間で定義・実装が矛盾している |

---

## ❌ 完全未実装

### 1. 有給休暇 申請・承認・管理

| 項目 | 内容 |
|------|------|
| **機能名** | 有給休暇申請・承認ワークフロー |
| **概要** | ユーザーが有給休暇を申請し、管理者が承認/却下する一連のワークフロー。及び有給付与日数の管理。 |
| **根拠 (DB)** | `paid_leave_requests` テーブル（leave_date, days, status=pending/approved/rejected, reason）、`paid_leave_grants` テーブル（days, granted_at, expires_at） |
| **根拠 (Model)** | `PaidLeaveRequest` / `PaidLeaveGrant` モデルが scopes（user, approved, pending, active）含め完全実装済み |
| **根拠 (UI)** | QuickActionsCard の「有給申請」ボタン（onClick なしのスタブ）、スケジュールサマリーに `paidLeaveDays` / `remainingPaidLeaveDays` 表示 |
| **現状** | CalendarService が読取専用でサマリー集計のみ利用。Controller / Service / API エンドポイント / 申請フォーム UI は一切なし |
| **必要な実装** | (1) PaidLeaveController (create/approve/reject/index) (2) PaidLeaveService (3) OpenAPI 定義 (4) 申請フォーム UI (5) 承認一覧 UI (6) PaidLeaveGrantController（管理者用付与管理） |
| **優先度** | 🔴 Critical |
| **影響範囲** | Backend: Controller, Service, FormRequest, Route / OpenAPI: 新規エンドポイント5以上 / Frontend: 新規ページ・フォーム・承認画面 |

---

### 2. 残業申請・承認・管理

| 項目 | 内容 |
|------|------|
| **機能名** | 残業申請・承認ワークフロー |
| **概要** | ユーザーが残業を事前申請し、管理者が承認/差戻し/キャンセルする一連のワークフロー |
| **根拠 (DB)** | `overtime_requests` テーブル（work_date, start_time, end_time, status=pending/approved/returned/canceled, reason） |
| **根拠 (Model)** | `OvertimeRequest` モデルが scopes（user, approved, pending, date）・status 定数・getDurationHours() 含め完全実装済み |
| **根拠 (UI)** | Dashboard に `pendingOvertimeRequests` 件数データ取得済み（ただし画面に表示なし）、stats に `overtimeHours` / `overtimeDiff` 表示 |
| **現状** | DashboardService / CalendarService が集計値としてのみ読取利用。Controller / Service / API エンドポイント / 申請 UI は一切なし |
| **必要な実装** | (1) OvertimeRequestController (create/approve/return/cancel/index) (2) OvertimeRequestService (3) OpenAPI 定義 (4) 申請フォーム UI (5) 承認一覧 UI |
| **優先度** | 🔴 Critical |
| **影響範囲** | Backend: Controller, Service, FormRequest, Route / OpenAPI: 新規エンドポイント5以上 / Frontend: 新規ページ・フォーム・承認画面 |

---

### 3. 申請・承認ページ

| 項目 | 内容 |
|------|------|
| **機能名** | 申請・承認統合ページ (`/approval`) |
| **概要** | 有給・残業・勤怠修正等の各種申請を一元管理する画面 |
| **根拠 (Frontend)** | `AppRoutePath.Approval = '/approval'` 定義済み、サイドバーに「申請・承認」メニューアイコン (FileText) 表示済み |
| **現状** | ルート定義のみで Route 未登録、ページコンポーネント未作成。クリックするとワイルドカードでダッシュボードにリダイレクト |
| **必要な実装** | (1) ApprovalPage コンポーネント (2) AppRoutes に Route 登録 (3) 各種申請リスト・承認操作 UI (4) 対応する Backend API |
| **優先度** | 🔴 Critical（有給・残業申請と同時実装） |
| **影響範囲** | Frontend: 新規ページ・hooks・API 呼出 |

---

### 4. パスワード変更

| 項目 | 内容 |
|------|------|
| **機能名** | パスワード変更機能 |
| **概要** | ユーザーが自身のパスワードを変更する |
| **根拠 (DB)** | `users.password` カラム。User モデルの `updating` イベントで Hash::make 適用あり |
| **根拠 (UI)** | Settings セキュリティセクションに「パスワードの変更」ラベルが `settingsSecurityActionLabels` に定義。`passwordLastChangedAt` 表示は常に null |
| **根拠 (OpenAPI)** | `SettingsSecurity.passwordLastChangedAt` フィールド定義あり |
| **現状** | Backend は SettingsService が `passwordLastChangedAt: null` を常にハードコード返却。変更 API なし |
| **必要な実装** | (1) パスワード変更 API エンドポイント (2) PasswordChangeRequest (3) Settings UI に変更フォーム (4) password_changed_at カラム追加（またはタイムスタンプ管理方法の決定） |
| **優先度** | 🟡 High |
| **影響範囲** | Backend: Controller action, FormRequest, migration / Frontend: 設定画面内フォーム / OpenAPI: 新規エンドポイント |

---

### 10. メール認証フロー

| 項目 | 内容 |
|------|------|
| **機能名** | メールアドレス認証（確認メール送信・認証リンク処理） |
| **概要** | ユーザーのメールアドレスを検証する |
| **根拠 (DB)** | `users.email_verified_at` カラム（nullable datetime） |
| **根拠 (UI)** | Settings セキュリティに認証済み/未認証アイコン表示 |
| **根拠 (OpenAPI)** | `SettingsSecurity.emailVerified` boolean 定義あり |
| **現状** | email_verified_at カラムは存在するが、認証メール送信・リンク検証ロジック・API エンドポイントは一切なし |
| **必要な実装** | (1) メール認証コントローラー (send/verify) (2) 認証メールテンプレート (3) UI に再送信ボタン (4) ミドルウェア（未認証時の制限） |
| **優先度** | 🟠 Medium |
| **影響範囲** | Backend: Controller, Notification/Mail, Route, Middleware / Frontend: 設定 UI ボタン追加 |

---



## ⚠️ 部分実装

### 14. ログイン履歴の記録

| 項目 | 内容 |
|------|------|
| **機能名** | ログイン時の履歴レコード自動記録 |
| **概要** | ログイン/ログアウト時に login_histories テーブルへ記録する |
| **根拠 (DB)** | `login_histories` テーブル（ip_address, user_agent, logged_in_at, logged_out_at） |
| **現状** | AuthService はログイン時に `users.last_login_at` を更新するのみ。login_histories テーブルへの INSERT がない。SettingsService は login_histories から最終ログインを読取っているが、レコードが書き込まれることがないため常に null を返す |
| **必要な実装** | (1) AuthService.login に LoginHistory::create 追加（ip_address, user_agent, logged_in_at 記録） (2) AuthService.logout に logged_out_at 更新追加 |
| **優先度** | 🔴 Critical（既存画面のデータ不整合直結） |
| **影響範囲** | Backend: AuthService のみ |

---

### 15. 勤怠一覧・修正画面

| 項目 | 内容 |
|------|------|
| **機能名** | 過去の勤怠レコードの一覧表示・修正 |
| **概要** | ユーザーが過去の勤怠記録を一覧表示し、修正申請する |
| **根拠 (Backend)** | AttendanceController に index / store / update アクションが実装済み。ルートも登録済み |
| **根拠 (OpenAPI)** | `GET /attendances` (listAttendancesApi)、`POST /attendances` (storeAttendanceApi)、`PATCH /attendances/{attendance}` (updateAttendanceApi) が定義済み |
| **根拠 (UI)** | QuickActionsCard の「勤怠修正」ボタン（onClick なしのスタブ） |
| **現状** | Backend API は動作可能だが、Frontend に一覧画面・修正フォームが未実装 |
| **必要な実装** | (1) 勤怠一覧ページ UI (2) 修正フォーム UI (3) useAttendanceList hooks / queries (4) API 呼出関数 |
| **優先度** | 🟡 High |
| **影響範囲** | Frontend のみ（Backend 実装済み） |

---

### 16. 休憩時間の表示

| 項目 | 内容 |
|------|------|
| **機能名** | 休憩合計時間の表示 |
| **概要** | 出勤中の休憩合計時間をリアルタイム表示 |
| **根拠 (DB)** | `attendances.break_minutes` カラム、`attendance_breaks` テーブル |
| **根拠 (Backend)** | AttendanceService が break_minutes を計算・保存済み |
| **現状** | AttendancePage の「休憩合計」が常に `--:--` 表示のハードコード。break_minutes をフロントが取得しているが表示に反映していない |
| **必要な実装** | (1) AttendancePage の休憩合計表示を実データに差替え |
| **優先度** | 🟡 High |
| **影響範囲** | Frontend: AttendancePage のみ |

---

### 17. 残業予定の表示

| 項目 | 内容 |
|------|------|
| **機能名** | 残業予定時間の表示 |
| **概要** | 勤務時間が所定を超えた分を残業として表示 |
| **現状** | AttendancePage の「残業予定」が常に `00:00` 表示のハードコード |
| **必要な実装** | (1) 残業予定の算出ロジック（所定勤務時間との差分） (2) フロントの表示差替え |
| **優先度** | 🟠 Medium |
| **影響範囲** | Frontend: AttendancePage（Backend 側の計算ロジック追加も検討） |

---

### 18. pendingOvertimeRequests の UI 表示

| 項目 | 内容 |
|------|------|
| **機能名** | 未承認残業申請件数の表示 |
| **概要** | ダッシュボードに未承認の残業申請件数を表示する |
| **根拠 (Backend)** | DashboardService が `pendingOvertimeRequests` を返却 |
| **根拠 (OpenAPI)** | `DashboardResponse.pendingOvertimeRequests` (integer) 定義済み |
| **現状** | Backend からデータ取得済みだが、Frontend のダッシュボード UI に表示箇所なし |
| **必要な実装** | (1) ダッシュボード UI にバッジ/カードで件数表示 (2) クリックで申請一覧へ遷移 |
| **優先度** | 🟠 Medium（申請機能実装後） |
| **影響範囲** | Frontend: ダッシュボード UI |

---

### 19. 勤怠ページのハードコードデータ

| 項目 | 内容 |
|------|------|
| **機能名** | 勤怠ページの位置情報・IP アドレス表示 |
| **概要** | 勤怠画面に表示される位置情報と IP アドレスが実データと連動していない |
| **現状** | 位置情報 `東京都港区港南` / IP `192.168.1.xxx` がハードコード文字列。API から取得していない |
| **必要な実装** | (1) 実際の IP アドレス取得（Backend から返却 or Frontend 側取得） (2) 位置情報は Geolocation API 連携または削除を検討 |
| **優先度** | 🔵 Low |
| **影響範囲** | Frontend / Backend（IP 返却の場合） |

---

### 20. チームメンバーのアクションボタン

| 項目 | 内容 |
|------|------|
| **機能名** | チームメンバー行の操作ボタン（メール・詳細・メニュー） |
| **概要** | メンバー行 hover 時に表示される Mail / MoreVertical / ChevronRight ボタン |
| **根拠 (UI)** | TeamPresenter に 3 つの `<Button>` が配置済み（onClick なし） |
| **現状** | ボタン UI のみのスタブ。クリックしても何も起きない |
| **必要な実装** | (1) メール送信（mailto リンクまたはモーダル） (2) メンバー詳細画面 (3) 操作メニュー（権限変更等） |
| **優先度** | 🔵 Low |
| **影響範囲** | Frontend: TeamPresenter / 新規詳細ページ |

---

## ❗ 設計不整合

### 21. DashboardController.clock メソッド未実装

| 項目 | 内容 |
|------|------|
| **機能名** | ダッシュボード打刻 API |
| **概要** | ダッシュボードからの統合打刻エンドポイント |
| **根拠 (Route)** | `POST /dashboard/clock` → `DashboardController::clock` がルート登録済み |
| **根拠 (FormRequest)** | `DashboardClockRequest` クラスが実装済み（schemaName = 'DashboardClockRequest'） |
| **根拠 (OpenAPI)** | `POST /dashboard/clock` (dashboardClockApi) + `DashboardClockRequest` (action: ClockAction) が定義済み |
| **現状** | DashboardController に `clock` メソッドが存在しない（`show` メソッドのみ）。ルートにアクセスすると `BadMethodCallException` (500) が発生する |
| **必要な実装** | (1) DashboardController に clock メソッド追加 (2) AttendanceService の clockIn/clockOut/breakStart/breakEnd を呼び出すディスパッチロジック |
| **優先度** | 🔴 Critical（500 エラーを引き起こすルート定義） |
| **影響範囲** | Backend: DashboardController |

---

### 22. UserStatus enum と DB 定義の不一致

| 項目 | 内容 |
|------|------|
| **機能名** | ユーザーステータス定義 |
| **概要** | OpenAPI と DB のユーザーステータス定義が不一致 |
| **根拠 (OpenAPI)** | `UserStatus` enum: `active`, `inactive`, `suspended`, `deleted` の 4 値 |
| **根拠 (DB)** | `users.status` は `CHECK (status IN (0, 1))` の 2 値（integer） |
| **現状** | OpenAPI は文字列 enum で 4 状態を定義するが、DB は 0/1 の integer。Backend は `(int) $user->status !== 1` で判定。Model の cast は `'status' => 'integer'` |
| **必要な実装** | (1) OpenAPI 側を DB に合わせて修正（0/1 or active/inactive のみ）、または (2) DB を文字列型に変更して 4 状態をサポート |
| **優先度** | 🟡 High |
| **影響範囲** | OpenAPI: enum 修正 / DB: migration（変更する場合） / Backend: Model cast / Frontend: 型定義 |

---

### 23. プロフィール編集ボタンのスタブ

| 項目 | 内容 |
|------|------|
| **機能名** | サイドバーのプロフィール編集 |
| **概要** | PrivateLayout のプロフィールアイコンクリック時の動作 |
| **根拠 (UI)** | PrivateLayout に `console.log("プロフィール編集")` のみのハンドラ |
| **現状** | クリックすると console.log のみ出力。設定画面への遷移や編集モーダルが未実装 |
| **必要な実装** | (1) `/settings` への遷移に差替え、または (2) プロフィール編集モーダル実装 |
| **優先度** | 🔵 Low |
| **影響範囲** | Frontend: PrivateLayout |

---

### 24. 病欠申請ボタンのスタブ

| 項目 | 内容 |
|------|------|
| **機能名** | 病欠申請 |
| **概要** | ダッシュボード QuickActions の「病欠申請」ボタン |
| **根拠 (UI)** | QuickActionsCard に「病欠申請」ボタン配置（onClick なし） |
| **現状** | DB にも Backend にも「病欠」に特化したスキーマ/ロジックがない。有給申請の一種として扱うか、別テーブルが必要か未定義 |
| **必要な実装** | (1) 病欠を有給申請のカテゴリとして統合する設計決定、または (2) 病欠専用テーブル・API・UI の追加 |
| **優先度** | 🟠 Medium |
| **影響範囲** | 設計判断後に全レイヤー |

---

## 📊 サマリー

### 実装済み機能 ✅

| 機能 | Backend | OpenAPI | Frontend |
|------|---------|---------|----------|
| ログイン / ログアウト / トークン更新 | ✅ | ✅ | ✅ |
| ダッシュボード（統計・最近の記録・ミニカレンダー） | ✅ | ✅ | ✅ |
| 打刻（出勤 / 退勤 / 休憩開始 / 休憩終了） | ✅ | ✅ | ✅ |
| スケジュール / カレンダー表示 | ✅ | ✅ | ✅ |
| チームメンバー一覧（閲覧のみ） | ✅ | ✅ | ✅ |
| 設定（プロフィール・通知・テーマ・言語） | ✅ | ✅ | ✅ |

### 未実装カウント

| カテゴリ | 件数 |
|---------|------|
| ❌ 完全未実装 | 13 件 |
| ⚠️ 部分実装 | 7 件 |
| ❗ 設計不整合 | 4 件 |
| **合計** | **24 件** |

### 優先度別

| 優先度 | 件数 | 代表例 |
|--------|------|--------|
| 🔴 Critical | 5 | 有給申請, 残業申請, 申請承認ページ, ログイン履歴記録, dashboard/clock |
| 🟡 High | 5 | パスワード変更, ログイン履歴閲覧, 祝日管理, ユーザー管理, 勤怠一覧UI, UserStatus不一致 |
| 🟠 Medium | 5 | 部署管理, 役職管理, メール認証, 残業予定表示, pendingOvertimeRequests表示, 病欠申請 |
| 🔵 Low | 5 | 2FA, メンバー招待, 月次レポート, チームアクション, ハードコードデータ, プロフィール編集 |

### 推奨実装順序

```
Phase 1 (Critical - 基盤)
  ├─ #14 ログイン履歴の記録（AuthService 修正のみ）
  ├─ #21 DashboardController.clock メソッド追加
  └─ #22 UserStatus enum 整合

Phase 2 (Critical - 申請ワークフロー)
  ├─ #1 有給休暇申請・承認
  ├─ #2 残業申請・承認
  └─ #3 申請・承認ページ

Phase 3 (High - ユーザー機能)
  ├─ #4 パスワード変更
  ├─ #15 勤怠一覧・修正画面（Backend 実装済み）
  └─ #16 休憩時間の表示（Frontend のみ）

Phase 5 (Medium)
  ├─ #10 メール認証
  ├─ #17 残業予定表示
  └─ #18 pendingOvertimeRequests 表示

Phase 6 (Low)
  ├─ #13 月次レポート
  └─ 残りのスタブ修正
```
