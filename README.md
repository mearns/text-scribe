# text-scribe

A simple Javascript module for writing lines of text with indenting.

## Example

```javascript
import {TextWriter} from 'text-writer';

const writer = new TextWriter();

writer.write('Hello').write(', World!').endline()
    .writeline('Here is a new line for you!')
    .indent()
    .writeline('This line is indented.')
    .writeline('This one, too.')
    .indent(2).writeline('This one is indented 3 times!')
    .outdent().writeline('This is only indented 2 times.')
    .setLevel().writeline('This one is back to no-indent.')
    .skipline()
    .writeline('Maybe this is a new paragraph, or something.')
    .endline()
    .write('This is still just on the next line, because the line was already ended.')
    .endline()
    .write('Next line, again.')
    .endline().endline().endline()
    .writeline('It is idempotent when invoked multiple times in a row.');

console.log(writer.toString());
```

The above code will write the following to console (including a blank line at the end).

```
Hello, World!
Here is a new line for you!
    This line is indented.
    This one, too.
            This one is indented 3 times!
        This is only indented 2 times.
This one is back to no-indent.

Maybe this is a new paragraph, or something.
This is still just on the next line, because the line was already ended.
Next line, again.
It is idempotent when invoked multiple times in a row.

```

## Install

Install via npm:

```bash
npm install --save text-scribe
```

## License

MIT

## API

### class `TextWriter`

#### constructor: `new TextWriter({initialLevel = 0, tab = 4, linesep = '\n'})`

The `initialLevel` param specifies the initial indent level, and defaults to 0.

The `tab` param specifies what to use for the tab at the beginning of each line,
for each level of indent. If a number, it specifies the number of ASCII space characters
to use for a tab. Otherwise, it is used as a string. The default is a string of four spaces.

The `linesep` param specifies what to use between lines. The default is a JavaScript linebreak,
`'\n'`.

#### `.write(text)` _(chainable)_

Append the given text to the current line.

#### `.writeline(text)` _(chainable)_

Append the given text to the current line, and then end the line. Subsequent writes
will be appended to subequent lines.

#### `.indent(amt = 1)` _(chainable)_

Increase the current _indent level_ by the specified amount, default is 1 level.
Negative values work as well, but the level is clamped at a minimum of 0.

#### `.outdent(amt = 1)` _(chainable)_

Decrease the current _indent level_ by the specified amount, default is 1 level.
Negative values work as well, but the level is clamped at a minimum of 0.

#### `.setLevel(level = 0)` _(chainable)_

Set the current _indent level_ to the specified value, clamped to a minimum of 0.

#### `.newline()` _(chainable)_

End the current line and create a new (null) line after it. This is the same as
calling `writeLine` with no argument.

#### `.blankline()` _(chainable)_

A convenience function for calling `newline()` twice in a row, leaving a blank
line following the current line.

#### `.endline()` _(chainable)_

If the current line is non-null, end it. Otherwise, do nothing.

#### `.skipline()` _(chainable)_

Ensures the current line is ended (as with `endline()`), and then adds a new line.
This is similar to `blankline()` except that if the current line is already _null_,
it _does not_ end it.

#### `toString()`

Renders the currently written text to a single string, using the currently configured
`linesep` and `tab` values.
