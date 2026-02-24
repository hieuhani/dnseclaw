import { randomUUID } from 'node:crypto';

import { buildSignature, formatDateHeader, type Algorithm } from './common.js';

export interface DNSEClientOptions {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  algorithm?: Algorithm;
  hmacNonceEnabled?: boolean;
}

type MarketType = string;

interface OrderPayload {
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  orderType: string;
  [key: string]: unknown;
}

interface DryRunOption {
  dryRun?: boolean;
}

export interface ApiResponse {
  status: number | null;
  body: string | null;
}

export class DNSEClient {
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly baseUrl: string;
  readonly algorithm: Algorithm;
  readonly hmacNonceEnabled: boolean;

  constructor({
    apiKey,
    apiSecret,
    baseUrl = 'https://openapi.dnse.com.vn',
    algorithm = 'hmac-sha256',
    hmacNonceEnabled = true,
  }: DNSEClientOptions) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.algorithm = algorithm;
    this.hmacNonceEnabled = hmacNonceEnabled;
  }

  getAccounts({ dryRun = false }: DryRunOption = {}): Promise<ApiResponse> {
    return this.#request('GET', '/accounts', { dryRun });
  }

  getBalances(accountNo: string, { dryRun = false }: DryRunOption = {}): Promise<ApiResponse> {
    return this.#request('GET', `/accounts/${accountNo}/balances`, { dryRun });
  }

  getLoanPackages(
    accountNo: string,
    marketType: MarketType,
    { symbol, dryRun = false }: { symbol?: string } & DryRunOption = {},
  ): Promise<ApiResponse> {
    const query: Record<string, string> = { marketType };
    if (symbol !== undefined) {
      query.symbol = symbol;
    }
    return this.#request('GET', `/accounts/${accountNo}/loan-packages`, { query, dryRun });
  }

  getDeals(accountNo: string, marketType: MarketType, { dryRun = false }: DryRunOption = {}): Promise<ApiResponse> {
    return this.#request('GET', `/accounts/${accountNo}/deals`, {
      query: { marketType },
      dryRun,
    });
  }

  getOrders(accountNo: string, marketType: MarketType, { dryRun = false }: DryRunOption = {}): Promise<ApiResponse> {
    return this.#request('GET', `/accounts/${accountNo}/orders`, {
      query: { marketType },
      dryRun,
    });
  }

  getOrderDetail(
    accountNo: string,
    orderId: string,
    marketType: MarketType,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('GET', `/accounts/${accountNo}/orders/${orderId}`, {
      query: { marketType },
      dryRun,
    });
  }

  getOrderHistory(
    accountNo: string,
    marketType: MarketType,
    { from, to, pageSize, pageIndex, dryRun = false }:
      & { from?: string; to?: string; pageSize?: number; pageIndex?: number }
      & DryRunOption = {},
  ): Promise<ApiResponse> {
    const query: Record<string, string | number> = { marketType };
    if (from !== undefined) {
      query.from = from;
    }
    if (to !== undefined) {
      query.to = to;
    }
    if (pageSize !== undefined) {
      query.pageSize = pageSize;
    }
    if (pageIndex !== undefined) {
      query.pageIndex = pageIndex;
    }
    return this.#request('GET', `/accounts/${accountNo}/orders/history`, {
      query,
      dryRun,
    });
  }

  getPpse(
    accountNo: string,
    marketType: MarketType,
    symbol: string,
    price: number,
    loanPackageId: string | number,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('GET', `/accounts/${accountNo}/ppse`, {
      query: {
        marketType,
        symbol,
        price: String(price),
        loanPackageId: String(loanPackageId),
      },
      dryRun,
    });
  }

  getSecurityDefinition(
    symbol: string,
    { boardId, dryRun = false }: { boardId?: string } & DryRunOption = {},
  ): Promise<ApiResponse> {
    const query: Record<string, string> = {};
    if (boardId !== undefined) {
      query.boardId = boardId;
    }
    return this.#request('GET', `/price/secdef/${symbol}`, {
      query,
      dryRun,
    });
  }

  postOrder(
    marketType: MarketType,
    payload: OrderPayload,
    tradingToken: string,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('POST', '/accounts/orders', {
      query: { marketType },
      body: payload,
      headers: { 'trading-token': tradingToken },
      dryRun,
    });
  }

  putOrder(
    accountNo: string,
    orderId: string,
    marketType: MarketType,
    payload: OrderPayload,
    tradingToken: string,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('PUT', `/accounts/${accountNo}/orders/${orderId}`, {
      query: { marketType },
      body: payload,
      headers: { 'trading-token': tradingToken },
      dryRun,
    });
  }

  cancelOrder(
    accountNo: string,
    orderId: string,
    marketType: MarketType,
    tradingToken: string,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('DELETE', `/accounts/${accountNo}/orders/${orderId}`, {
      query: { marketType },
      headers: { 'trading-token': tradingToken },
      dryRun,
    });
  }

  createTradingToken(
    otpType: string,
    passcode: string,
    { dryRun = false }: DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('POST', '/registration/trading-token', {
      body: { otpType, passcode },
      dryRun,
    });
  }

  sendEmailOtp(
    email: string,
    { otpType = 'email_otp', dryRun = false }: { otpType?: string } & DryRunOption = {},
  ): Promise<ApiResponse> {
    return this.#request('POST', '/registration/send-email-otp', {
      body: { email, otpType },
      dryRun,
    });
  }

  async #request(
    method: string,
    path: string,
    { query, body, headers, dryRun }:
      & {
        query?: Record<string, string | number>;
        body?: Record<string, unknown>;
        headers?: Record<string, string>;
      }
      & DryRunOption = {},
  ): Promise<ApiResponse> {
    const debug = String(process.env.DEBUG || '').toLowerCase() === 'true';
    const url = this.#buildUrl(path, query);
    const { dateValue, signatureHeaderValue } = this.#signatureHeaders(method, path);

    const requestHeaders: Record<string, string> = {
      Date: dateValue,
      'X-Signature': signatureHeaderValue,
      'x-api-key': this.apiKey,
    };

    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    if (debug || dryRun) {
      const prefix = dryRun ? 'DRY RUN' : 'DEBUG';
      const queryParams = query || {};
      console.log(`${prefix} url:`, url);
      console.log(`${prefix} method:`, method);
      console.log(`${prefix} query_params:`, queryParams);
      console.log(`${prefix} headers:`, requestHeaders);
      console.log(`${prefix} body:`, body);
    }

    if (dryRun) {
      return { status: null, body: null };
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const responseBody = await response.text();
    return { status: response.status, body: responseBody };
  }

  #buildUrl(path: string, query?: Record<string, string | number>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  #signatureHeaders(method: string, path: string): { dateValue: string; signatureHeaderValue: string } {
    const dateValue = formatDateHeader(new Date());
    const nonce = this.hmacNonceEnabled ? randomUUID().replace(/-/g, '') : null;
    const { headers, signature } = buildSignature(
      this.apiSecret,
      method,
      path,
      dateValue,
      this.algorithm,
      nonce,
    );

    let signatureHeaderValue = `Signature keyId="${this.apiKey}",algorithm="${this.algorithm}",headers="${headers}",signature="${signature}"`;
    if (nonce) {
      signatureHeaderValue += `,nonce="${nonce}"`;
    }

    return { dateValue, signatureHeaderValue };
  }
}
