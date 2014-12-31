## Summary

* [网站](http://www.rawgit.com/altitudelabs/imaibo-public/master/index.html)
* [T3网站](http://t3-www.imaibo.net/index.php?app=moodindex&mod=Feelings&act=chart)

## Deployment Steps

1. Connect to VPN
2. Connect to FTP
3. Manually update chart.html, bearing in mind the change in path for JS and CSS files [TODO: Any way to make this more efficient]
4. Update template in deploy/chart.html to public/themes/Maibo/apps/moodindex/Feelings/chart.html
5. Toggle HIDE in app.js
6. Update JS files in public/themes/Maibo/common_v2
7. Update bower components in public/bower_components
