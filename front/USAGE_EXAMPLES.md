/**
 * コンポーネント使用例・デモ
 */

// ========================================
// 1. Atoms（基本コンポーネント）の使用例
// ========================================

// Button
import { Button } from '@/shared/components/atoms';

<Button variant="primary" size="lg">
  ログイン
</Button>

<Button variant="danger" loading={isLoading}>
  削除
</Button>

// Input
import { Input } from '@/shared/components/atoms';

<Input
  type="email"
  placeholder="メールアドレス"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={hasError}
  errorMessage="正しいメールアドレスを入力してください"
/>

// Text
import { Text } from '@/shared/components/atoms';

<Text variant="h1" weight="bold">
  見出し
</Text>

<Text variant="body" color="secondary">
  本文テキスト
</Text>

// Badge
import { Badge } from '@/shared/components/atoms';

<Badge variant="success">
  承認済み
</Badge>

// Card
import { Card } from '@/shared/components/atoms';

<Card variant="elevated" padding="lg">
  <Text variant="h4">カードタイトル</Text>
  {/* content */}
</Card>

// ========================================
// 2. Molecules（組み合わせコンポーネント）
// ========================================

// FormField
import { FormField } from '@/shared/components/molecules';

<FormField
  label="ユーザー名"
  required
  type="text"
  placeholder="username"
  value={username}
  onChange={handleChange}
  error={hasError}
  errorMessage="3文字以上入力してください"
/>

// ButtonGroup
import { ButtonGroup } from '@/shared/components/molecules';

<ButtonGroup>
  <Button>確認</Button>
  <Button variant="secondary">キャンセル</Button>
</ButtonGroup>

// Alert
import { Alert } from '@/shared/components/molecules';

<Alert
  type="success"
  title="成功"
  description="操作が完了しました"
  closable
/>

// ========================================
// 3. Organisms（大型コンポーネント）
// ========================================

// Header
import { Header } from '@/shared/components/organisms';

<Header
  title="ダッシュボード"
  subtitle="本日の勤務状況"
  userName="田中太郎"
  onLogout={handleLogout}
/>

// Sidebar
import { Sidebar } from '@/shared/components/organisms';

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
  { id: 'attendance', label: '出退勤', icon: '⏰' },
];

<Sidebar
  items={navItems}
  onNavClick={(item) => navigate(item.href)}
/>

// MainLayout
import { MainLayout } from '@/shared/components/organisms';

<MainLayout
  navItems={navItems}
  headerTitle="タイトル"
  userName="ユーザー名"
  onLogout={handleLogout}
>
  {/* ページコンテンツ */}
</MainLayout>

// Modal
import { Modal } from '@/shared/components/organisms';

<Modal
  open={isOpen}
  onClose={closeModal}
  title="確認"
  actions={[
    { label: 'OK', onClick: handleOk },
  ]}
>
  削除してもよろしいですか？
</Modal>

// ========================================
// 4. Hooks の使用例
// ========================================

// useForm
import { useForm } from '@/shared/hooks';

const { values, errors, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  async (values) => {
    await login(values);
  },
  (values) => ({
    email: !isValidEmail(values.email) ? 'Invalid email' : '',
  })
);

// useAsync
import { useAsync } from '@/shared/hooks';

const { data: records, isLoading, error } = useAsync(
  () => fetchAttendanceRecords(),
  true
);

// useLocalStorage
import { useLocalStorage } from '@/shared/hooks';

const [token, setToken, removeToken] = useLocalStorage('auth_token', null);

// useDebounce
import { useDebounce } from '@/shared/hooks';

const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 500);

useEffect(() => {
  // debouncedQuery を使用した検索実行
}, [debouncedQuery]);

// ========================================
// 5. ユーティリティ関数
// ========================================

import {
  cn,
  formatDate,
  getTimeDifference,
  isValidEmail,
  formatNumber,
  chunkArray,
} from '@/shared/utils';

// クラス名のマージ
const className = cn('bg-blue-500', error && 'bg-red-500');

// 日付フォーマット
const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm');

// 時間差分計算
const { hours, minutes } = getTimeDifference(start, end);

// メール検証
if (isValidEmail(email)) {
  // OK
}

// 数値フォーマット
const salary = formatNumber(1000000, 0); // 1,000,000

// 配列チャンク分割
const chunks = chunkArray(items, 10);

// ========================================
// 6. レスポンシブデザイン
// ========================================

// Tailwindのユーティリティクラス使用
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
  {/* レスポンシブグリッド */}
</div>

// ========================================
// 7. テーマの使用
// ========================================

import { theme } from '@/shared/style/theme';

const primaryColor = theme.colors.primary[600];
const spacing = theme.spacing.md;
const fontSize = theme.typography.fontSize.lg;

// ========================================
// 8. API 通信
// ========================================

import { apiClient, login, clockIn } from '@/shared/api/client';

// ログイン
try {
  const response = await login('user@example.com', 'password');
  const { token } = response.data;
  setAuthToken(token);
} catch (error) {
  showError('ログインに失敗しました');
}

// 出勤
try {
  const response = await clockIn();
  showSuccess('出勤しました');
} catch (error) {
  showError('出勤に失敗しました');
}

// ========================================
// 9. 定数の使用
// ========================================

import {
  BREAKPOINTS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  USER_ROLES,
  ATTENDANCE_STATUS,
  TIMEOUTS,
} from '@/shared/constants';

const isSmallScreen = window.innerWidth < BREAKPOINTS.md;
const apiUrl = API_ENDPOINTS.auth.login;
const token = localStorage.getItem(STORAGE_KEYS.authToken);

// ========================================
// 10. コンテナコンポーネント（ページ）
// ========================================

// pages/login/LoginPage.tsx
export function LoginPage({ onLoginSuccess }) {
  // ビジネスロジック・API通信
  // Moleculesやorganismsを組み合わせてUIを構成

  return (
    <div>
      <Card>
        <FormField label="メール" />
        <FormField label="パスワード" type="password" />
        <Button onClick={handleLogin}>ログイン</Button>
      </Card>
    </div>
  );
}

// pages/dashboard/DashboardPage.tsx
export function DashboardPage() {
  // ダッシュボードロジック

  return (
    <div>
      <Text variant="h1">ダッシュボード</Text>
      {/* コンテンツ */}
    </div>
  );
}
