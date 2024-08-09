type TagEvent =
  | "tag:ready"
  | "tag:mount"
  | "tag:unmount"
  | "tag:select"
  | "tag:deselect"
  | "tag:change";
type DataEvent =
  | "data:update"
  | "data:lock"
  | "data:unlock"
  | "data:undo"
  | "data:redo"
  | "data:restore";
type Event = TagEvent | DataEvent;

export default class EventEmitter {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  public on(event: Event, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(listener);
  }

  public off(event: Event, listener: Function) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event]!.filter((l) => l !== listener);
  }

  public emit(event: Event, ...args: any[]) {
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
// tag:change: a single tag is updated => key, newValue, prevValue
// data:update: tag data changes => newTagData
// data:lock: tag data is locked
// data:unlock: tag data is unlocked
// data:undo: changes are undone => newValue, prevValue
// data:redo: changes are redone => newValue, prevValue
// data:restore: changes are reset => newTags, oldTags
