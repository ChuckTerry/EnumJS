# EnumJS
Enum Implementation in Javascript with ability to lock and unlock.

Version: 1.2.1

## Usage
### Instantiation
  // The Starting Value will always be the first vaue passed to the constructor
  new Enum(**Array of States**, **Surpress Errors** \[optional]);
  const myEnum = new Enum(['OFF', 'LOW', 'MID', 'HIGH'], false);
  
  // Or use the static from() method
  const myEnum = Enum.from('OFF', 'LOW', 'MID', 'HIGH']);

## Check if object is Enum
  Enum.isEnum(myEnum) // --> True

### Get Current State
  const currentState = myEnum.getState(); // --> 'OFF'

  // Or use the accessor
  const currentState = myEnum.state; // --> 'OFF'

### Set Current State
  myEnum.setState('MID'); // --> 'MID'

  // Or use the accessor
  myEnum.state = 'MID'; // --> 'MID'

### Get Number of Valid States
  myEnum.length; // --> 4

### Get All Valid States
  myEnum.getValidStates(); // --> ['OFF', 'LOW', 'MID', 'HIGH']

### Test if State is Valid
  myEnum.isValidState('MAX'); // --> false

### Locking
  // Locking an Enum will return a key (Symbol) used to unlock it again
  const myKey = myEnum.lock();

  myEnum.setState('LOW'); // Throws an error (Or nothing if surpressed);

  myEnum.unlock(myKey);
  myEnum.setState('LOW'); // Succeeds

  // Locking Enum with a "true" parameter locks it permanently and returns true
  myEnum.lock(true); // --> true

### Checking Lock Status
  myEnum.isLocked(); // --> true
