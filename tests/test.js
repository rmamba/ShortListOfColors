describe('Wikipedia', function() {

    before(browser => browser.url('https://en.wikipedia.org/wiki/List_of_colors_(compact)'))

    test('parse', function (browser) {
      browser
        .waitForElementVisible('body')
        .assert.titleContains('List of colors (compact) - Wikipedia')
        .assert.containsText('h1', 'List of colors (compact)')
        .assert.containsText('#List_of_colors', 'List of colors')

        .assert.containsText('#A', 'A')
        .assert.containsText('#B', 'B')
        .assert.containsText('#C', 'C')
        .assert.containsText('#D', 'D')
        .assert.containsText('#E', 'E')
        .assert.containsText('#F', 'F')
        // .assert.containsText('#G-H', 'G-H')
        // .assert.containsText('#I-K', 'I-K')
        .assert.containsText('#L', 'L')
        .assert.containsText('#M', 'M')
        // .assert.containsText('#N-O', 'N-O')
        // .assert.containsText('#P-Q', 'P-Q')
        .assert.containsText('#R', 'R')
        .assert.containsText('#S', 'S')
        .assert.containsText('#T', 'T')
        // .assert.containsText('#U-V', 'U-V')
        // .assert.containsText('#W-Z', 'W-Z')
    })

    after(browser => browser.end())
})
