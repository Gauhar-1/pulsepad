import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

class ErrorEventEmitter {
  private emitter = new EventEmitter();

  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    this.emitter.emit(event, ...args);
  }

  on<E extends keyof Events>(event: E, listener: Events[E]) {
    this.emitter.on(event, listener);
  }

  off<E extends keyof Events>(event: E, listener: Events[E]) {
    this.emitter.off(event, listener);
  }
}

export const errorEmitter = new ErrorEventEmitter();
