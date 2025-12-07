graph TB
subgraph "Client Layer"
A[React + Vite<br/>Browser]
B[Mobile App<br/>Future]
C[Merchant API<br/>Third-Party]
end

    subgraph "API Gateway Layer"
        D[Express Server<br/>CORS, Helmet, Rate Limiting]
    end

    subgraph "Authentication Layer"
        E[JWT Middleware<br/>Verify & Refresh Tokens]
    end

    subgraph "Application Layer"
        F[Auth Service<br/>Register, Login, Logout]
        G[Transaction Service<br/>Payments, History, Stats]
    end

    subgraph "Data Layer"
        H[(PostgreSQL<br/>Users, Transactions, Audit Logs)]
    end

    A -->|HTTPS| D
    B -.->|HTTPS| D
    C -->|REST API| D
    D --> E
    E --> F
    E --> G
    F --> H
    G --> H

    style A fill:#fff2cc,stroke:#d6b656
    style B fill:#fff2cc,stroke:#d6b656,stroke-dasharray: 5 5
    style C fill:#fff2cc,stroke:#d6b656
    style D fill:#e1d5e7,stroke:#9673a6
    style E fill:#f8cecc,stroke:#b85450
    style F fill:#b1ddf0,stroke:#10739e
    style G fill:#b1ddf0,stroke:#10739e
    style H fill:#b0e3e6,stroke:#0e8088
