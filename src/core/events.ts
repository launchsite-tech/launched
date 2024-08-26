/** @internal Events related to individual tag behavior.  */
type TagEvent =
  | "tag:ready"
  | "tag:mount"
  | "tag:unmount"
  | "tag:select"
  | "tag:deselect"
  | "tag:change";

/** @internal Events related to overall data changes.  */
type DataEvent =
  | "data:update"
  | "data:lock"
  | "data:unlock"
  | "data:undo"
  | "data:redo"
  | "data:restore";

/**
 * @internal
 *
 * All events that can be emitted and traced by the {@link EventEmitter}.
 *
 * @remarks
 * - `tag:ready`: A tag is bound to an element => id, tag
 * - `tag:mount`: Tag UI component renders => id, tag
 * - `tag:unmount`: Tag UI component unmounts => id, tag
 * - `tag:select`: Tag UI gains focus => id, tag
 * - `tag:deselect`: Tag UI loses focus => id, tag
 * - `tag:change`: A single tag is updated => key, newValue, prevValue
 * - `data:update`: Tag data changes => newTagData
 * - `data:lock`: Tag data is locked
 * - `data:unlock`: Tag data is unlocked
 * - `data:undo`: Changes are undone => newValue, prevValue
 * - `data:redo`: Changes are redone => newValue, prevValue
 * - `data:restore`: Changes are reset => newTags, oldTags
 */
type Event = TagEvent | DataEvent;

/**
 * @internal
 *
 * A simple event emitter that allows for subscribing to and emitting events.
 *
 * @see {@link Event} for all possible events.
 */
export default class EventEmitter {
  /** @internal The events and their listeners. */
  private events: Record<Event, Function[]>;

  /** @internal Creates a new event emitter. */
  constructor() {
    this.events = {} as any;
  }

  /**
   * Subscribes to an event.
   *
   * @param event - The event to subscribe to
   * @param listener - The function to call when the event is emitted
   */
  public on(event: Event, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(listener);
  }

  /**
   * @internal
   *
   * Unsubscribes from an event.
   *
   * @param event - The event to unsubscribe from
   * @param listener - The function to remove from the event
   */
  public off(event: Event, listener: Function) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event]!.filter((l) => l !== listener);
  }

  /**
   * @internal
   *
   * Emits an event.
   *
   * @param event - The event to emit
   * @param args - Any arguments to pass to the event
   */
  public emit(event: Event, ...args: any[]) {
    if (!this.events[event]) return;

    this.events[event]!.forEach((listener) => listener(...args));
  }
}
