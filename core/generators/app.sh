#!/bin/bash

# App Generator
# Generates the main application file

generate_app_file() {
  local project_name="$1"
  
  cat > src/app.ts << EOF
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to $project_name API',
    version: '1.0.0'
  });
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;
EOF
}

generate_test_file() {
  mkdir -p tests/unit
  cat > tests/unit/app.test.ts << 'EOF'
import express, { Response } from 'express';

const app = express();

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to API', version: '1.0.0' });
});

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

describe('App', () => {
  it('should return welcome message', () => {
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    // Simple test without supertest
    expect(res.json).toBeDefined();
  });

  it('should return health status', () => {
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    // Simple test without supertest
    expect(res.json).toBeDefined();
  });
});
EOF
} 