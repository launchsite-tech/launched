export default class EventEmitter {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  public on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(listener);
  }

  public off(event: string, listener: Function) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event]!.filter((l) => l !== listener);
  }

  public emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;

    this.events[event]!.forEach((listener) => listener(...args));
  }
}

// Events:
// tag:ready: a tag is bound to an element => id, tag
// tag:mount: tag UI component renders => id, tag
// tag:unmount: tag UI component unmounts => id, tag
// tag:select: tag UI gains focus => id, tag
// tag:deselect: tag UI loses focus => id, tag
// tag:change: a single tag is updated => key, newValue, originalValue
// data:update: tag data changes => newTagData
// data:lock: tag data is locked
// data:unlock: tag data is unlocked
