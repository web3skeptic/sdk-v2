/**
 * Observable class for event streaming
 * Provides a simple publish-subscribe pattern for Circles events
 */
export class Observable<TEvent> {
  private readonly _subscribers: ((event: TEvent) => void)[] = [];

  /**
   * Subscribe to events
   * @param subscriber Callback function to be called for each event
   * @returns Unsubscribe function to stop receiving events
   */
  subscribe(subscriber: (value: TEvent) => void): () => void {
    this._subscribers.push(subscriber);
    return () => {
      const index = this._subscribers.indexOf(subscriber);
      if (index > -1) {
        this._subscribers.splice(index, 1);
      }
    };
  }

  protected constructor() {
    this._subscribers = [];
  }

  protected emit(value: TEvent) {
    this._subscribers.forEach(sub => sub(value));
  }

  /**
   * Create a new Observable with an emitter
   */
  public static create<T>(): { property: Observable<T>; emit: (e: T) => void } {
    const observable = new Observable<T>();
    return {
      property: observable,
      emit: (e) => observable.emit(e)
    };
  }
}
