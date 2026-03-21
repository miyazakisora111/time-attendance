# AWS デプロイメント構成

## 概要

AWS を想定した本番デプロイメントアーキテクチャ。ECS Fargate、RDS、ElastiCache を活用したコンテナベースの構成を解説する。

## インフラ全体像

```mermaid
graph TD
    subgraph "AWS Cloud"
        subgraph "VPC"
            subgraph "Public Subnet"
                ALB["Application<br/>Load Balancer"]
            end

            subgraph "Private Subnet"
                subgraph "ECS Fargate"
                    Nginx["Nginx<br/>Sidecar"]
                    App["PHP-FPM<br/>Laravel"]
                    Front["Nginx<br/>React Static"]
                end

                RDS["RDS<br/>PostgreSQL 15"]
                Redis["ElastiCache<br/>Redis 7"]
            end
        end

        CF["CloudFront<br/>CDN"]
        S3["S3<br/>静的アセット"]
        SM["Secrets Manager"]
        CW["CloudWatch"]
        Route53["Route 53"]
    end

    User["ユーザー"] --> Route53
    Route53 --> CF
    CF --> ALB
    ALB --> Nginx
    Nginx --> App
    Nginx --> Front
    App --> RDS
    App --> Redis
    CF --> S3
    App --> SM
    App --> CW
```

## ECS タスク定義

```mermaid
graph LR
    subgraph "ECS Task"
        Nginx["nginx<br/>コンテナ<br/>:80"]
        App["app<br/>コンテナ<br/>:9000"]

        Nginx -->|"FastCGI"| App
    end
```

| コンテナ | イメージ | CPU | メモリ |
|---|---|---|---|
| nginx | `nginx:1.27-alpine` | 256 | 512 MB |
| app | `ECR/time-attendance-app:latest` | 512 | 1024 MB |

## デプロイフロー

```mermaid
sequenceDiagram
    participant Dev as 開発者
    participant GH as GitHub Actions
    participant ECR as ECR
    participant ECS as ECS Fargate

    Dev->>GH: main ブランチへマージ
    GH->>GH: テスト実行
    GH->>GH: Docker イメージビルド
    GH->>ECR: docker push
    GH->>ECS: タスク定義更新
    ECS->>ECS: ローリングアップデート
    ECS->>ECS: ヘルスチェック通過後に旧タスク停止
```

## GitHub Actions (CD)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ap-northeast-1

      - uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push
        run: |
          docker build -t $ECR_REGISTRY/app:${{ github.sha }} \
            --target prod -f infra/php/Dockerfile back/
          docker push $ECR_REGISTRY/app:${{ github.sha }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster time-attendance \
            --service api \
            --force-new-deployment
```

## 環境変数管理

| 変数カテゴリ | 管理場所 | 例 |
|---|---|---|
| 非秘密 | ECS タスク定義 `environment` | `APP_ENV=production` |
| 秘密 | Secrets Manager → `secrets` | `DB_PASSWORD`, `JWT_SECRET` |
| インフラ | Systems Manager Parameter Store | `DB_HOST` (RDS エンドポイント) |

## RDS 設定

| パラメータ | 値 |
|---|---|
| エンジン | PostgreSQL 15 |
| インスタンス | `db.t3.medium` |
| ストレージ | 50 GB gp3 |
| Multi-AZ | 有効 |
| バックアップ保持 | 7 日 |
| 暗号化 | 有効 (KMS) |

## スケーリング

```mermaid
graph LR
    subgraph "Auto Scaling"
        Min["最小: 2 タスク"]
        Desired["通常: 2 タスク"]
        Max["最大: 10 タスク"]
    end

    CPU["CPU > 70%"] -->|"スケールアウト"| Max
    CPU2["CPU < 30%"] -->|"スケールイン"| Min
```

## 注意: 設計レビュー指摘事項

| 問題 | 影響 | 改善案 |
|---|---|---|
| **マイグレーション実行タイミング** | ECS タスク起動時に毎回実行される | 別途マイグレーション用 ECS タスクを定義し、デプロイ時に 1 回だけ実行 |
| **ログの永続化** | コンテナ停止時にログが消失 | CloudWatch Logs へ直接出力 (`awslogs` ログドライバー) |
| **ヘルスチェックのパス** | ALB のヘルスチェックが `/` だと Vite のページを返す | `/api/health` を ALB のヘルスチェックパスに設定 |
| **Blue/Green デプロイ未対応** | ローリングアップデートではダウンタイムが発生する可能性 | CodeDeploy + Blue/Green デプロイメントを検討 |
| **コスト最適化** | 常時 2 タスク稼働はオーバースペックの可能性 | 利用パターンを分析し、夜間はスケールインする |
