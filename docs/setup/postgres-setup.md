# PostgreSQL セットアップ手順（Linux / Ubuntu 想定）

本手順書は、Linux（Ubuntu）環境に PostgreSQL をセットアップし、
アプリケーション用の **データベース・ユーザー・拡張・権限設定** を行うためのものです。

---

## 前提条件

- Linux（Ubuntu 20.04 以上推奨）
- sudo 権限を持つユーザー

---

## 構成概要

- DB名: `time_attendance`
- DBユーザー: `time_attendance`
- 初期パスワード: `change_me`（必ず変更）
- 使用拡張: uuid-ossp, pgcrypto, citext

---

## 1. PostgreSQL のインストール

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start
```

## 2. 初期化 SQL の実行

```bash
cat infra/postgres/init.sql | sudo -u postgres psql -d postgres -f -
```

---

## 3. 確認

```bash
sudo -u postgres psql -d time_attendance
```

```sql
\dx
\dn+
\du+ time_attendance
```

---

## 4. パスワード変更（必須）

```bash
sudo -u postgres psql -d postgres -c "ALTER ROLE time_attendance PASSWORD 'strong_password';"
```

---

## 5. Laravel 接続設定例

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=time_attendance
DB_USERNAME=time_attendance
DB_PASSWORD=strong_password
```
