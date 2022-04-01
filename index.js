/**
 * Enum implementation with errors surpressed by default, {@link https://github.com/ChuckTerry|View on Github}
 * @author Chuck Terry <ct.jcpm@gmail.com>
 * @copyright Chuck Terry 2021 - 2022
 * @license AGPL-3.0-or-later
 * @version 1.2.1
 */
class Enum {

  /** @private {*} Current state (value) of the enum */
  #currentState;
  /** @private {boolean} Is the enum locked in it's current state */
  #locked;
  /** @private {Symbol} Key to unlock the enum */
  #lockKey;
  /** @private {Array} List of valid states the enum can exist in */
  #states;
  /** @private {boolean} Should errors on instances be surpressed or thrown, static methods NEVER surpress errors */
  #surpressErrors

  /**
   * First converts arguments to Array, then the Array to an Enum
   * @returns {Enum} - Enum created from arguments
   */
  static from() {
    return new Enum(Array.from(arguments));
  }

  /**
   * Returns true if parameter is an Enum
   * @param {*} object - Object to test if instance of Enum
   * @returns {boolean} - is object an instance of Enum
   */
  static isEnum(object) {
    return object instanceof Enum;
  }

  /**
   * Enum Constructor
   * @param {*} statesArray - Array of values to implement as Enum states
   * @param {boolean} surpressErrors - Should errors be surpressed
   */
  constructor(statesArray, surpressErrors = true) {

    let states = statesArray;

    // If no parameters are passed to constructor
    if (!statesArray) {
      if (!surpressErrors) {
        throw new TypeError(`Enum must be constructed with exactly One (1) argument`);
      } else {
        states = [true];
      }
    }

    // If first parameter is not an Array, try to coerce it
    if (!Array.isArray(states)) {
      let forcedStates = [true];

      try {
        forcedStates = Array.from(states);
      } catch (error) {
        if (!surpressErrors) {
          throw new TypeError(`Enum must be constructed with exactly One (1) argument that is an array-like object`);
        } else {
          forcedStates = [true];
        }
      } finally {
        states = forcedStates;
      }
    }

    // Initialize all private class members
    this.#currentState = states[0];
    this.#locked = false;
    this.#lockKey = null;
    this.#states = states;
    this.#surpressErrors = surpressErrors;

  }

  /**
   * Implement iterator over private member states
   * @since 1.1.0
   * @returns {Iterator} Iterator representing Enum's states
   */
  [Symbol.iterator]() {

    let index = 0;

    return {
      next: () => {
        if (index < this.#states.length) {
          return { value: this.#states[index++], done: false }
        } else {
          return { done: true }
        }
      }
    }

  }

  // Implement search as a state-validity check
  [Symbol.search](string) {
    return this.indexOf(string);
  }

  // Primitive Coercion, note that default is non-normative
  [Symbol.toPrimitive](hint) {

    switch (hint) {
      case `number`:
        return this.#states.indexOf(this.#currentState);
      case `string`:
        return this.#currentState.toString();
      default:
        return this.#currentState;
    }

  }

  // this.toString() === "[object Enum]"
  [Symbol.toStringTag]() {
    return `Enum`;
  }

  /**
   * Required for iterator implementation
   * @returns {number} Number of Enum states
   */
  get length() {
    return this.#states.length;
  }

  /**
   * Dummy setter forcongruancy compliance
   * @returns false
   */
  set length(length) {
    return length === Symbol(length.toString());
  }

  // Accessor shortcut
  get state() {
    return this.getState();
  }

  // Accessor shortcut
  set state(state) {
    return this.setState(state);
  }

  // Accessor shortcut
  get states() {
    return this.getValidStates();
  }

  /**
   * Dummy setter for congruancy compliance
   * @returns false
   */
  set states(states) {
    return states === Symbol(states.toString());
  }

  // Accessor shortcut following commonly accepted naming conventions
  get value() {
    return this.getState();
  }

  // Accessor shortcut following commonly accepted naming conventions
  set value(value) {
    return this.setState(value);
  }

  // Array.forEach() implemented as callable
  forEach() {
    return Array.prototype.forEach.apply(this.#states, arguments);
  }

  /**
   * Get the Enum's current state
   * @returns {*} Current Enum state
   */
  getState() {
    return this.#currentState;
  }

  /**
   * Get the Enum's possible states
   * @returns {Array} Array of valid states for this Enum
   */
  getValidStates() {
    return this.#states;
  }

  /**
   * IndexOf implementation to compare valid states
   * @param {*} state - State to verify
   * @returns {number} internal index of state, or -1 if it doesn't exist
   */
  indexOf(state) {
    return this.#states.indexOf(state);
  }

  /**
   * Returns Enum's lock status
   * @since 1.1.0
   * @returns {boolean} indicates if the Enum is locked
   */
  isLocked() {
    return !!this.#locked;
  }

  /**
   * Check if a certain state is valid for this Enum
   * @param {*} state - State to check validity of
   * @returns {boolean} indicated if the state is a valid one.
   */
  isValidState(state) {
    return this.indexOf(state) > -1;
  }

  /**
   * Lock the Enum to it's current state
   * @since 1.1.0
   * @param {boolean} permanent - Should the Enum be irreversibly locked to it's current state
   * @returns {Symbol|Boolean} Symbol containing the key, true if permanently locked, or false if already locked
   */
  lock(permanent = false) {

    if (this.isLocked() === true) {
      if (!this.#surpressErrors) {
        throw new Error(`Enum is already locked`);
      } else {
        return false;
      }
    }

    this.#locked = true
    this.#lockKey = Symbol(`EnumLock`);

    return (permanent === true) ? true : this.#lockKey;

  }

  /**
   * Updates the Enum's current State
   * @param {*} state - State the Enum should change to
   * @returns {*} State of Enum after update
   */
  setState(state) {

    if (!this.isValidState(state)) {
      if (!this.#surpressErrors) {
        throw new RangeError(`"${state}" is not a valid state`);
      } else {
        return this.#currentState;
      }
    }

    if (this.isLocked()) {
      if (!this.#surpressErrors) {
        throw new TypeError(`State cannot be changed on Enum in locked state`);
      } else {
        return this.#currentState;
      }
    }

    return this.#currentState = state;

  }

  /**
   * Unlock the Enum
   * @since 1.2.0
   * @param {Symbol} key - Key to unlock the Enum
   * @returns {boolean} Whether unlocking the Enum was successful
   */
  unlock(key) {

    if (this.isLocked() === false) {
      if (!this.#surpressErrors) {
        throw new Error(`Enum is already unlocked`);
      } else {
        return false;
      }
    }

    if (key !== this.#lockKey) {
      if (!this.#surpressErrors) {
        throw new TypeError(`Invalid key to unlock Enum`);
      } else {
        return false;
      }
    }

    this.#locked = false;
    this.#lockKey = null;

    return true;

  }

  // ValueOf implementation to follow commonly accepted naming conventions
  valueOf() {
    return this.getState();
  }

}
