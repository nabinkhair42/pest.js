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
  cat > src/__tests__/app.test.ts << 'EOF'
import request from 'supertest';
import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to API', version: '1.0.0' });
});

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

describe('App', () => {
  it('should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Welcome');
  });

  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
EOF
} 