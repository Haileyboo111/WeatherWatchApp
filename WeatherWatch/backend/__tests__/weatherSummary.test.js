import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';

// Mock OpenAI client so tests stay offline and deterministic
const mockCreate = vi.fn();

describe('POST /api/weather-summary', () => {
  let app;

  beforeEach(async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.NODE_ENV = 'test';
    vi.resetModules();
    mockCreate.mockReset().mockResolvedValue({ output_text: 'AI says hello.' });
    global.__mockOpenAI = { responses: { create: mockCreate } };
    const module = await import('../server');
    app = module.default || module;
  });

  afterEach(() => {
    delete global.__mockOpenAI;
  });

  it('returns AI summary when OpenAI responds', async () => {
    const payload = { weatherData: { temp: 72, condition: 'Sunny' } };

    const res = await request(app).post('/api/weather-summary').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.summary).toBe('AI says hello.');
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-5-nano',
        input: expect.stringContaining('weather summary'),
        store: true,
      })
    );
  });

  it('returns 400 when weatherData is missing', async () => {
    const res = await request(app).post('/api/weather-summary').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/weatherData is required/i);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 500 when OpenAI call fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('OpenAI down'));
    const res = await request(app)
      .post('/api/weather-summary')
      .send({ weatherData: { temp: 60 } });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/failed to generate summary/i);
  });
});
