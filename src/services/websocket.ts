'use client';

import { io, Socket } from 'socket.io-client';
import { useCallback } from 'react';
import { WS_BASE_URL } from '@/lib/axios';

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | 'BALANCE_UPDATE'
  | 'ORDER_UPDATE'
  | 'PRICE_UPDATE'
  | 'TRADE_UPDATE'
  | 'POSITION_UPDATE'
  | 'NOTIFICATION'
  | string;

/**
 * WebSocket message structure
 */
export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
  timestamp: number;
}

/**
 * Callback type for event listeners
 */
type EventCallback = (payload: any) => void;

/**
 * Singleton WebSocket service
 * Handles socket.io connection, reconnection, and event management
 */
class WebSocketService {
  private socket: Socket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000; // 3 seconds
  private shouldReconnect: boolean = true;
  private listeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private isConnecting: boolean = false;

  constructor(url: string = WS_BASE_URL) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        setTimeout(() => this.connect(token).then(resolve).catch(reject), 100);
        return;
      }

      this.isConnecting = true;
      const socketUrl = `${this.url}/spot`;
      const options: any = {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
      };

      // Only add auth if token exists
      if (token && token.trim()) {
        options.auth = { token };
      }

      try {
        console.log('[WebSocket] connect()', { socketUrl, hasAuth: Boolean(token && token.trim()) });
        this.socket = io(socketUrl, options);

        this.socket.on('connect', () => {
          console.log('✓ WebSocket connected', {
            socketId: this.socket?.id,
            url: socketUrl,
            readyState: this.getReadyState(),
          });
          this.isConnecting = false;
          this.reconnectAttempts = 0;

          this._attachStoredListeners();
          this._processMessageQueue();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('✗ WebSocket connect error:', error, {
            socketUrl,
            auth: Boolean(token),
          });
          this.isConnecting = false;
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('✗ WebSocket disconnected', reason);
          this.isConnecting = false;
          if (this.shouldReconnect) {
            this._attemptReconnect(token);
          }
        });
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.shouldReconnect = false;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.messageQueue = [];
  }

  /**
   * Send message to server
   */
  emit(type: string, payload: any): void {
    const message: WebSocketMessage = {
      type: type as WebSocketEventType,
      payload,
      timestamp: Date.now(),
    };

    if (this.socket?.connected) {
      this.socket.emit(type, payload);
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * Subscribe to WebSocket events
   */
  on(type: WebSocketEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(callback);
    if (this.socket?.connected) {
      this.socket.on(type, callback);
    }

    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        callbacks.delete(callback);
        if (this.socket) {
          this.socket.off(type, callback);
        }
      }
    };
  }

  /**
   * Subscribe once to WebSocket event
   */
  once(type: WebSocketEventType, callback: EventCallback): () => void {
    const wrapper = (payload: any) => {
      callback(payload);
      unsubscribe();
    };

    const unsubscribe = this.on(type, wrapper);
    return unsubscribe;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get WebSocket ready state
   */
  getReadyState(): number {
    return this.socket?.connected ? 1 : 0;
  }

  /**
   * Attach listeners that were registered before connection
   */
  private _attachStoredListeners(): void {
    if (!this.socket) return;
    this.listeners.forEach((callbacks, type) => {
      callbacks.forEach((callback) => {
        this.socket?.on(type, callback);
      });
    });
  }

  /**
   * Process queued messages after reconnection
   */
  private _processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.socket?.connected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.socket.emit(message.type, message.payload);
      }
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private _attemptReconnect(token?: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    setTimeout(() => {
      this.connect(token).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }
}

/**
 * Export singleton instance
 */
export const wsService = new WebSocketService();

/**
 * Hook to initialize WebSocket connection in React components
 */
export function useWebSocketConnection(enabled: boolean = true) {
  const connect = useCallback(async () => {
    if (!enabled) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      await wsService.connect(token || undefined);
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }, [enabled]);

  return { connect, wsService };
}
