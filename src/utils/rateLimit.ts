export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCallTime = 0;
  private callsPerSecond: number;

  constructor(callsPerSecond: number) {
    this.callsPerSecond = callsPerSecond;
  }

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    const minTimeBetweenCalls = 1000 / this.callsPerSecond;

    if (timeSinceLastCall < minTimeBetweenCalls) {
      await new Promise(resolve => 
        setTimeout(resolve, minTimeBetweenCalls - timeSinceLastCall)
      );
    }

    const fn = this.queue.shift();
    if (fn) {
      this.lastCallTime = Date.now();
      await fn();
    }

    this.processQueue();
  }
}