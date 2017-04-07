// Support
import {expect} from 'chai';

// Module under test
import * as textScribe from '../src/';

describe('The textScribe module', () => {
    describe('The TextWriter class', () => {
        describe('Sanity check', () => {
            it('should pass a simple sanity check', () => {
                // given
                const writer = new textScribe.TextWriter();

                // When
                writer.write('Hello').write(', World!').endline()
                    .writeline('Here is a new line for you!')
                    .indent()
                    .writeline('This line is indented.')
                    .writeline('This one, too.')
                    .indent(2).writeline('This one is indented 3 times!')     // eslint-disable-line no-magic-numbers
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

                // Then
                expect(writer.toString()).to.equal([
                    'Hello, World!',
                    'Here is a new line for you!',
                    '    This line is indented.',
                    '    This one, too.',
                    '            This one is indented 3 times!',
                    '        This is only indented 2 times.',
                    'This one is back to no-indent.',
                    '',
                    'Maybe this is a new paragraph, or something.',
                    'This is still just on the next line, because the line was already ended.',
                    'Next line, again.',
                    'It is idempotent when invoked multiple times in a row.',
                    ''
                ].join('\n'));
            });
        });
    });
});
