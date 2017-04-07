/**
 * A Class for writing out plain text. Pretty simple, but surprisingly useful.
 */
export class TextWriter {

    /**
     * Instantiate a new TextWriter, with the specified configuration
     *
     * :param NonNegativeInt initialLevel:  The initial indent level. Default is 0.
     * :param String|NonNegativeInt tab:    What to use for a "tab" at the beginning
     *      of lines. If a String, the indent will be created by concatenating an
     *      appropriate number of copies of this string. If a number, it specifies the
     *      number of ASCII space character (0x20) to use for each tab. Default is
     *      a string of four spaces.
     * :param String linesep:   The string to use to separate lines. Default is '\n'.
     */
    constructor({initialLevel = 0, tab = '    ', linesep = '\n'} = {}) {    // eslint-disable-line no-magic-numbers
        this._lines = [];
        this.setLevel(initialLevel);
        this.setLinesep(linesep);
        this.setTab(tab);
    }

    getLinesep() {
        return this._linesep;
    }

    setLinesep(linesep) {
        this._linesep = linesep;
        return this;
    }

    getTab() {
        return this._tab;
    }

    setTab(tab) {
        if (typeof tab === 'number') {
            this._tab = Array.apply(null, Array(tab)).map(() => ' ').join(''); // eslint-disable-line prefer-spread
        }
        else {
            this._tab = String(tab);
        }
        return this;
    }

    getLevel() {
        return this._currentLevel;
    }

    setLevel(level = 0) {   // eslint-disable-line no-magic-numbers
        this._currentLevel = level;
        if (this._currentLevel < 0) {   // eslint-disable-line no-magic-numbers
            this._currentLevel = 0;
        }
        return this;
    }

    /**
     * Gets the current line, whether it actually exists or is null (or
     * undefined if there are _no_ lines yet).
     */
    _currentLine() {
        return this._lines[this._lines.length - 1]; // eslint-disable-line no-magic-numbers
    }

    /**
     * Get the last line if it exists. If it doesn't, create it as an empty
     * but existing line with the current level as it's indent, and add it to the list.
     * Either way, return it.
     */
    _ensureCurrentLine() {
        const currentLine = this._currentLine();
        if (currentLine) {
            return currentLine;
        }
        else {
            const newLine = {level: this._currentLevel, content: []};
            const lineCount = this._lines.length;
            if (lineCount) {
                this._lines[lineCount - 1] = newLine;   // eslint-disable-line no-magic-numbers
            }
            else {
                // First line
                this._lines.push(newLine);
            }
            return newLine;
        }
    }

    /**
     * Add a new null line to the end of the list. This means that it
     * won't actually get an indent level until you start writing
     * to it.
     */
    _startNewLine() {
        this._lines.push(null);
    }

    /**
     * Increase the indent level by the specified number of levels.
     * Negative values work as well to decrease the indent, to a minimum
     * level of 0. The default amount is 1 to indent by one level.
     * Returns back `this` writer.
     */
    indent(amt = 1) {       // eslint-disable-line no-magic-numbers
        return this.setLevel(this._currentLevel += amt);
    }

    /**
     * Decrease the indent level by the specified number of levels,
     * to a minimum of 0.
     * This simply negates the given value and passes the result to
     * `indent`.
     */
    outdent(amt = 1) {      // eslint-disable-line no-magic-numbers
        return this.indent(-amt);
    }

    /**
     * Append the specified text to the current line.
     *
     * @return `this` Writer object.
     */
    write(text) {
        this._ensureCurrentLine().content.push(text);
        return this;
    }

    /**
     * Append the specified text to the current line, and _then_
     * start a new (empty) line.
     *
     * Default `text` parameter is an empty string, which has the effect
     * of ending the current line.
     *
     * @return `this` Writer object.
     */
    writeLine(text = '') {
        this.write(text);
        this._startNewLine();
        return this;
    }

    /**
     * End the current line and a new null line after it.
     * This is the same as calling `writeLine` with no argument.
     *
     * @return `this` Writer object.
     */
    newline() {
        return this.writeLine();
    }

    /**
     * End the current line and add a blank line after it,
     * leaving the cursor on the next line after the blank line.
     *
     * This is the same as calling `newline` twice in a row.
     *
     * @return `this` Writer object.
     */
    blankline() {
        return this.newline().newline();
    }

    /**
     * Ensure that if the current line is non-null, it is
     * ended. In other words, calling this several times in a row
     * is the same as calling it once.
     *
     * @return `this` Writer object.
     */
    endline() {
        if (this._currentLine()) {
            this.newline();
        }
        return this;
    }

    _getIndentString(level) {
        return Array.apply(null, Array(level)).map(() => this._tab).join('');   // eslint-disable-line prefer-spread
    }

    /**
     * Generate and return a string representing the text that has been written
     * to the writer so far, using the current `linesep` and `tab` settings.
     */
    toString() {
        return this._lines.map((line) => {
            if (line) {
                const {level, content} = line;
                return `${this._getIndentString(level)}${content.join('')}`;
            }
            else {
                return '';
            }
        }).join(this._linesep);
    }
}
