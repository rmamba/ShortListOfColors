const puppeteer = require('puppeteer');

String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    Object.keys(arguments[k]).forEach(key => {
      a = a.replace("{" + key + "}", arguments[k][key])  
    })
  }
  return a
}

let parseColors = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      // '--proxy-server=socks5://127.0.0.1:9050'
    ]
  });
  const page = await browser.newPage()

  var URL = 'https://en.wikipedia.org/wiki/List_of_colors_(compact)'

  await Promise.all([
    page.goto(URL),
    page.setViewport({width: 1000, height: 800}),
    page.waitForNavigation({ waitUntil: 'load' })
  ]).catch(err => {
    return err
  })

  const result = await page.evaluate(() => {
    const colorDIVs = document.querySelectorAll('#mw-content-text > div.mw-parser-output > div[style="float:left;display:inline;font-size:90%;margin:1px 5px 1px 5px;width:11em; height:6em;text-align:center;padding:auto;"]')
    results = []
    cnt = 0
    gcnt = 0
    group = ''

    function slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
    }

    colorDIVs.forEach(div => {
      // results.push(div.innerHTML)
      const infos = div.querySelectorAll('p')
      var title
      infos.forEach(p => {
        const t = p.getAttribute('title')
        if (t) {
          title = t
        } else {
          const a = p.querySelector('a')
          if (a) {
            const parts = title.split("\n")
            if (group !== a.innerHTML[0]) {
              group = a.innerHTML[0]
              gcnt = 0
            }
            const name = a.innerHTML.toString()
            results.push({
              code: group + (gcnt++).toString(16).padStart(2, '0'),
              idx: cnt++,
              hsv: parts[0].substr(8, parts[0].length-9),
              rgb: parts[1].substr(8, parts[1].length-9),
              hex: parts[2].substr(8),
              name: name,
              slug: slugify(name)
            })
          }
        }
      })
    })

    return results
  }).catch(err => {
    return err
  })

  await browser.close();
  return result
}

parseColors().then((colors) => {
  colors.forEach(color => {
    console.log("{idx}, '{code}', '{name}', '{slug}', '{\"hex\": \"{hex}\", \"rgb\": \"{rgb}\", \"hsv\": \"{hsv}\"}'".format(color))
  })
}).catch(err => console.log(err))
