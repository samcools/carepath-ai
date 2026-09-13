import type { OpenAISettings } from './domain.js';

let runtimeKey = process.env.OPENAI_API_KEY || '';
let settings: OpenAISettings = {
  enabled: Boolean(runtimeKey),
  model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
  baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  hasApiKey: Boolean(runtimeKey),
  allowSyntheticDemoData: false
};

export function getOpenAISettings(): OpenAISettings {
  return { ...settings, hasApiKey: Boolean(runtimeKey) };
}

export function updateOpenAISettings(input: Partial<OpenAISettings> & { apiKey?: string }) {
  if (typeof input.enabled === 'boolean') settings.enabled = input.enabled;
  if (typeof input.model === 'string' && input.model.trim()) settings.model = input.model.trim().slice(0, 120);
  if (typeof input.baseUrl === 'string' && input.baseUrl.trim()) settings.baseUrl = input.baseUrl.trim().replace(/\/$/, '').slice(0, 300);
  if (typeof input.allowSyntheticDemoData === 'boolean') settings.allowSyntheticDemoData = input.allowSyntheticDemoData;
  if (typeof input.apiKey === 'string' && input.apiKey.trim()) runtimeKey = input.apiKey.trim();
  settings.hasApiKey = Boolean(runtimeKey);
  return getOpenAISettings();
}

export async function testOpenAISettings() {
  if (!settings.enabled) return { ok: false, message: 'OpenAI integration is disabled.' };
  if (!runtimeKey) return { ok: false, message: 'No OpenAI API key is configured.' };
  const response = await fetch(`${settings.baseUrl}/responses`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${runtimeKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: settings.model, input: 'Reply with exactly: CarePath connection OK', max_output_tokens: 32 })
  });
  if (!response.ok) {
    const body = await response.text();
    return { ok: false, message: `OpenAI returned ${response.status}: ${body.slice(0, 220)}` };
  }
  return { ok: true, message: 'OpenAI connection succeeded.' };
}

function extractText(json: any): string {
  if (typeof json?.output_text === 'string') return json.output_text;
  const content = json?.output?.flatMap((o: any) => o?.content || []).find((c: any) => c?.type === 'output_text' || typeof c?.text === 'string');
  if (typeof content?.text === 'string') return content.text;
  return '';
}

export async function openAIFallback(userInput: string): Promise<string | null> {
  if (!settings.enabled || !runtimeKey) return null;
  const system = [
    'You are Ayanda, the CarePath AI product assistant in a synthetic hackathon demonstrator.',
    'Help users navigate CarePath features and explain workflows clearly.',
    'Do not diagnose, prescribe, recommend treatment, rank real hospitals, or invent patient facts.',
    'All patient and outcome data in this environment is synthetic. If asked about hospital quality, explain that observed demo outcomes are not risk-adjusted and are not a real quality ranking.',
    'Keep answers concise. Never claim live government or hospital integration.'
  ].join(' ');
  const response = await fetch(`${settings.baseUrl}/responses`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${runtimeKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: settings.model, input: `${system}\n\nUser: ${userInput}`, max_output_tokens: 280 })
  });
  if (!response.ok) return null;
  const json = await response.json();
  return extractText(json) || null;
}
