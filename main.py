def common_format():
  pass

def to_html(common_fmt):
  pass

def to_svg(common_fmt):
  pass

common = common_format()
html = to_html(common)
svg = to_svg(common)

print("""
<!DOCTYPE html>
<html>
  <hbead></head>
  <body>
    {0}
    <hr/>
    {1}
  </body>
</html>
""".format(html, svg))
